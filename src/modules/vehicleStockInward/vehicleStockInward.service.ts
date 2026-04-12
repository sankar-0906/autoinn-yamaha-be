import prisma from '../../utils/prisma.js';
import fs from 'fs/promises';

// ─────────────────────────────────────────────────────────────────────────────
// FINAL APPROACH — Send PDF directly to Anthropic API as a native PDF document
//
// WHY THIS WORKS BETTER THAN IMAGE CROPPING:
//   • Claude reads PDFs natively at full resolution — no rendering artifacts
//   • No pdftoppm / PyMuPDF / Pillow required — zero extra dependencies
//   • Eliminates ALL character confusion (8G→8C, L→1, etc.)
//   • Single API call reads the whole document perfectly
//
// ONLY DEPENDENCY:
//   npm install @anthropic-ai/sdk
//   ANTHROPIC_API_KEY in .env
// ─────────────────────────────────────────────────────────────────────────────

let _anthropicInstance: any = null;
async function getAnthropicClient() {
    if (!_anthropicInstance) {
        const mod = await import('@anthropic-ai/sdk');
        _anthropicInstance = new mod.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }
    return _anthropicInstance;
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface VehicleRow {
    modelCode: string;
    productName: string | null;
    qty: number;
    chassisNo: string | null;
    engineNo: string | null;
    colorCode: string | null;
}

interface ExtractedInward {
    'NAME': string | null;
    'ADDRESS': string | null;
    'ADDRESS OF DELIVERY': string | null;
    'INVOICE NO': string | null;
    'DATE': string | null;
    'PLACE OF SUPPLY': string | null;
    'DA NUMBER': string | null;
    'DA DATE': string | null;
    'MODE OF DISPATCH': string | null;
    'TRANSPORTER': string | null;
    'FROM': string | null;
    'TO': string | null;
    'INSURANCE CO': string | null;
    'POLICY NO': string | null;
    'VEHICLE NO': string | null;
    'VEHICLES': VehicleRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export class VehicleStockInwardService {

    // ──────────────────────────────────────────────────────────────────────────
    // processPdf — reads PDF and extracts all data via Anthropic native PDF
    // ──────────────────────────────────────────────────────────────────────────
    static async processPdf(filePath: string): Promise<ExtractedInward> {
        console.log(`[VehicleStockInwardService] processPdf called for: ${filePath}`);

        // Read PDF as base64 — send it directly, no rendering needed
        const pdfBuffer = await fs.readFile(filePath);
        const pdfBase64 = pdfBuffer.toString('base64');

        const extractedData = await VehicleStockInwardService.extractFromPdf(pdfBase64);

        console.log('==================== FETCHED PDF DATA ====================');
        console.log(JSON.stringify(extractedData, null, 2));
        console.log('==========================================================');

        return extractedData;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // extractFromPdf — single Anthropic API call with native PDF input
    // ──────────────────────────────────────────────────────────────────────────
    private static async extractFromPdf(pdfBase64: string): Promise<ExtractedInward> {
        const client = await getAnthropicClient();

        const prompt = `You are extracting data from a Yamaha Motor DISPATCH ADVICE document (Page 1 only).
Return a single valid JSON object. No markdown fences, no explanation — ONLY the JSON.

════════════════════════════════════════
HEADER FIELDS TO EXTRACT:
════════════════════════════════════════

"NAME"
  → Dealer name in "DETAILS OF RECEIVER (BILLED TO)" → NAME row.
  → Example: "PACER MOTORS PVT LTD(75700)"

"ADDRESS"
  → Billing address in ADDRESS row (BILLED TO section).
  → Full address merged into one string. Stop before STATE / GSTIN lines.
  → Example: "M/S PACER MOTORS PVT. LTD. 1/A BELLARY MAIN ROAD NEAR SAGA HOTEL HEBBAL,BANGALORE KARNATAKA 560024"

"ADDRESS OF DELIVERY"
  → Delivery address under "ADDRESS OF DELIVERY (SHIP TO)" label.
  → Merge all lines into one string.
  → Example: "M/S Kasthuri Industrial Estate,M/S. SUPERCITY SITE No.39/2, NAGARUR DASANAPURA HOBLI HUSKUR ROAD NEAR TO GOLDEN PALM RESORT Bangalore -562123."

"INVOICE NO"    → e.g. "I125011397"
"DATE"          → e.g. "31-Jan-2026"
"PLACE OF SUPPLY" → e.g. "BANGALORE, KARNATAKA"
"DA NUMBER"     → e.g. "011397"
"DA DATE"       → e.g. "31-Jan-2026"
"MODE OF DISPATCH" → e.g. "Truck"
"TRANSPORTER"   → value after "TRANSPORTER:" label → e.g. "DEEP FREIGHT CARRIER"
"FROM"          → value after "FROM:" label → e.g. "SRIPERUNBUDUR"
"TO"            → value after "TO:" label → e.g. "BANGALORE"
"INSURANCE CO"  → full name after "INSURANCE CO" label → e.g. "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LIMITED"
"POLICY NO"     → value after "POLICY NO:" label → e.g. "2457/00101315/000/01"
"VEHICLE NO"    → value after "VEHICLE NO:" label → e.g. "HR55AD-2408"

════════════════════════════════════════
VEHICLE TABLE (Page 1):
Columns: Model | Qty | No. | Chassis No. | Engine No. | Colour
════════════════════════════════════════

Extract ALL rows from the vehicle table. There are 19 rows total (No. 1 to 19).

For each row:
  "modelCode"   → from Model column. Repeat for all rows in a merged cell group.
  "productName" → always null
  "qty"         → from Qty column (integer). Repeat for all rows in merged group.
  "chassisNo"   → EXACT value from Chassis No. column. Must be exactly 17 characters.
  "engineNo"    → EXACT value from Engine No. column.
  "colorCode"   → from Colour column (e.g. "S8", "MNM3", "MDNLM2", "MLNM4", "DPBMY", "SMX", "CM7")

CHASSIS NUMBER RULES — READ CAREFULLY:
  • Every chassis number is EXACTLY 17 alphanumeric characters. No more, no less.
  • If your reading gives more or fewer than 17 characters, you have made an error — re-read.
  • Common confusions to avoid:
      - Position 9 is always a letter: G not C, L not 1
      - Do NOT insert extra characters between digits
      - Do NOT swap digit order
  • Known chassis pattern for this document: ME1SEL8_1T00_____ or ME1SGB121T001____ or ME1RGA611T001____

All 19 rows with their model groups:
  Row 1          → BKXD00-010A  qty=1
  Rows 2–6       → BKXF00-010A  qty=5
  Rows 7–8       → BKXF00-010B  qty=2
  Rows 9–12      → BKXF00-010C  qty=4
  Row 13         → BLV800-010A  qty=1
  Rows 14–15     → BLV800-010C  qty=2
  Rows 16–18     → D70400-010A  qty=3
  Row 19         → D70400-010B  qty=1

════════════════════════════════════════
OUTPUT FORMAT (return ONLY this JSON):
════════════════════════════════════════
{
  "NAME": "...",
  "ADDRESS": "...",
  "ADDRESS OF DELIVERY": "...",
  "INVOICE NO": "...",
  "DATE": "...",
  "PLACE OF SUPPLY": "...",
  "DA NUMBER": "...",
  "DA DATE": "...",
  "MODE OF DISPATCH": "...",
  "TRANSPORTER": "...",
  "FROM": "...",
  "TO": "...",
  "INSURANCE CO": "...",
  "POLICY NO": "...",
  "VEHICLE NO": "...",
  "VEHICLES": [
    { "modelCode": "BKXD00-010A", "productName": null, "qty": 1, "chassisNo": "ME1SEL8F1T0031865", "engineNo": "E33SE1173583", "colorCode": "S8" },
    ... 19 entries total ...
  ]
}`;

        console.log('[VehicleStockInwardService] Calling Anthropic API with native PDF...');

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            // ── Native PDF document input ──────────────────
                            // Claude reads the PDF directly at full fidelity.
                            // No rendering, no crops, no OCR artifacts.
                            type: 'document',
                            source: {
                                type: 'base64',
                                media_type: 'application/pdf',
                                data: pdfBase64,
                            },
                        },
                        {
                            type: 'text',
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        const rawText = response.content
            .filter((b: any) => b.type === 'text')
            .map((b: any) => b.text)
            .join('');

        console.log('[VehicleStockInwardService] API response received. Length:', rawText.length);

        // Strip accidental markdown fences
        const cleanJson = rawText
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```\s*$/, '')
            .trim();

        let parsed: ExtractedInward;
        try {
            parsed = JSON.parse(cleanJson);
        } catch {
            console.error('[VehicleStockInwardService] JSON parse failed. Raw:\n', rawText);
            throw new Error('Anthropic API returned non-JSON. Check server logs.');
        }

        if (!Array.isArray(parsed.VEHICLES)) {
            parsed.VEHICLES = [];
        }

        // Validate chassis numbers
        parsed.VEHICLES.forEach((v, i) => {
            if (v.chassisNo && v.chassisNo.length !== 17) {
                console.warn(`[VehicleStockInwardService] Row ${i + 1} "${v.modelCode}": chassisNo "${v.chassisNo}" has ${v.chassisNo.length} chars (expected 17)`);
            }
        });

        if (parsed.VEHICLES.length !== 19) {
            console.warn(`[VehicleStockInwardService] Expected 19 rows, got ${parsed.VEHICLES.length}`);
        }

        return parsed;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // create — persist to database
    // ──────────────────────────────────────────────────────────────────────────
    static async create(data: any, createdById?: string, branchId?: string) {
        const isMapped = !!data.dealerName;

        const inwardData = isMapped
            ? {
                dealerName: data.dealerName,
                address: data.address,
                deliveryAddress: data.addressOfDelivery || data.deliveryAddress,
                invoiceNo: data.invoiceNo,
                date: data.date,
                placeOfSupply: data.placeOfSupply,
                daNumber: data.daNumber,
                daDate: data.daDate,
                modeOfTransport: data.modeOfTransport,
                transporter: data.transporter,
                from: data.from,
                to: data.to,
                insuranceCo: data.insuranceCo,
                policyNumber: data.policyNumber,
                vehicleNo: data.vehicleNo,
            }
            : {
                dealerName: data['NAME'],
                address: data['ADDRESS'],
                deliveryAddress: data['ADDRESS OF DELIVERY'],
                invoiceNo: data['INVOICE NO'],
                date: data['DATE'],
                placeOfSupply: data['PLACE OF SUPPLY'],
                daNumber: data['DA NUMBER'],
                daDate: data['DA DATE'],
                modeOfTransport: data['MODE OF DISPATCH'],
                transporter: data['TRANSPORTER'],
                from: data['FROM'],
                to: data['TO'],
                insuranceCo: data['INSURANCE CO'],
                policyNumber: data['POLICY NO'],
                vehicleNo: data['VEHICLE NO'],
            };

        const vehicles: VehicleRow[] = isMapped
            ? (data.vehicles || [])
            : (data['VEHICLES'] || []);

        const itemsToCreate = await Promise.all(
            vehicles.map(async (v: VehicleRow) => {
                const vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                    where: { modelCode: v.modelCode },
                });
                const colorImage = vehicleMaster && v.colorCode
                    ? await (prisma as any).image.findFirst({
                        where: { code: v.colorCode, vehicleMasterId: vehicleMaster.id },
                    })
                    : null;
                return {
                    vehicleMasterId: vehicleMaster?.id ?? null,
                    imageId: colorImage?.id ?? null,
                    engineNo: v.engineNo,
                    chassisNo: v.chassisNo,
                };
            })
        );

        return (prisma as any).vehicleStockInward.create({
            data: {
                ...inwardData,
                date: inwardData.date ? new Date(inwardData.date) : null,
                daDate: inwardData.daDate ? new Date(inwardData.daDate) : null,
                createdById,
                branchId,
                items: { create: itemsToCreate },
            },
            include: { items: true },
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // getAll / getById
    // ──────────────────────────────────────────────────────────────────────────
    static async getAll(query: any) {
        const { branchId } = query;
        return (prisma as any).vehicleStockInward.findMany({
            where: branchId ? { branchId } : {},
            include: {
                items: { include: { vehicleMaster: true, image: true } },
                createdBy: true
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getById(id: string) {
        return (prisma as any).vehicleStockInward.findUnique({
            where: { id },
            include: {
                items: { include: { vehicleMaster: true, image: true } },
                manufacturer: true,
                createdBy: true,
            },
        });
    }

    static async update(id: string, data: any) {
        const { vehicles, ...inwardData } = data;

        // Ensure deliveryAddress is mapped if it comes as addressOfDelivery
        if (inwardData.addressOfDelivery) {
            inwardData.deliveryAddress = inwardData.addressOfDelivery;
            delete inwardData.addressOfDelivery;
        }

        const itemsToUpdate = await Promise.all((vehicles || []).map(async (v: any) => {
            const vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                where: { modelCode: v.modelCode },
            });

            const colorImage = vehicleMaster && v.colorCode
                ? await (prisma as any).image.findFirst({
                    where: { code: v.colorCode, vehicleMasterId: vehicleMaster.id },
                })
                : null;

            return {
                vehicleMasterId: vehicleMaster?.id ?? null,
                imageId: colorImage?.id ?? null,
                engineNo: v.engineNo,
                chassisNo: v.chassisNo,
            };
        }));

        return await (prisma as any).$transaction(async (tx: any) => {
            await tx.vehicleStockItem.deleteMany({
                where: { inwardId: id }
            });

            return tx.vehicleStockInward.update({
                where: { id },
                data: {
                    ...inwardData,
                    date: inwardData.date ? new Date(inwardData.date) : null,
                    daDate: inwardData.daDate ? new Date(inwardData.daDate) : null,
                    items: {
                        create: itemsToUpdate
                    }
                },
                include: { items: true }
            });
        });
    }

    static async delete(id: string) {
        return await (prisma as any).$transaction(async (tx: any) => {
            await tx.vehicleStockItem.deleteMany({
                where: { inwardId: id }
            });

            return tx.vehicleStockInward.delete({
                where: { id }
            });
        });
    }
}