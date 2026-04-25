import fs from 'fs/promises';
import { execSync } from 'child_process';
import Tesseract from 'tesseract.js';
import path from 'path';
import os from 'os';
import { PDFParse } from 'pdf-parse';
import prisma from '../../utils/prisma.js';
import { IdGeneratorService } from '../idGenerator/idGenerator.service.js';
import { FrameNumberService } from '../frameNumber/frameNumber.service.js';

// ─────────────────────────────────────────────────────────────────────────────
// REGEX-BASED PDF PARSER (REPLACES ANTHROPIC CLAUDE API)
// ─────────────────────────────────────────────────────────────────────────────

interface VehicleRow {
    modelCode: string;
    productName: string | null;
    qty: number;
    chassisNo: string | null;
    engineNo: string | null;
    colorCode: string | null;
    mfgDate?: Date | null;
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

export class VehicleStockInwardService {

    // ──────────────────────────────────────────────────────────────────────────
    // processPdf — reads PDF using pdf-parse and extracts data via Regex
    // ──────────────────────────────────────────────────────────────────────────
    static async processPdf(filePath: string): Promise<ExtractedInward> {
        console.log(`[VehicleStockInwardService] processPdf called for: ${filePath}`);

        let text = "";
        try {
            const pdfBuffer = await fs.readFile(filePath);
            const parser = new PDFParse({ data: pdfBuffer });
            const pdfData = await parser.getText();
            text = pdfData.text || "";
            console.log(`[VehicleStockInwardService] Initial parse text length: ${text.length}`);
        } catch (err) {
            console.error('[VehicleStockInwardService] pdf-parse failed:', err);
        }

        // If text is too short or doesn't look like a valid document, try OCR
        if (text.length < 100 || !text.includes('DISPATCH ADVICE')) {
            console.log('[VehicleStockInwardService] Attempting OCR fallback...');
            const ocrText = await VehicleStockInwardService.extractViaOCR(filePath);
            if (ocrText && ocrText.length > text.length) {
                text = ocrText;
                console.log(`[VehicleStockInwardService] OCR successful. New text length: ${text.length}`);
            }
        }

        if (text.length < 100) {
            console.warn('[VehicleStockInwardService] Extremely low text content after all attempts.');
        }

        // 1. Identify the core "DISPATCH ADVICE" page content
        if (!text.includes('DISPATCH ADVICE')) {
            console.warn('[VehicleStockInwardService] "DISPATCH ADVICE" not found in text. Parsing might be inaccurate.');
        }

        const extractedData = VehicleStockInwardService.extractViaRegex(text);

        console.log('==================== EXTRACTED PDF DATA (REGEX) ====================');
        console.log(JSON.stringify(extractedData, null, 2));
        console.log('===================================================================');

        return extractedData;
    }

    private static extractViaRegex(text: string): ExtractedInward {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        const getValue = (label: string | RegExp, options: { stop?: RegExp; nextLine?: boolean; pattern?: RegExp } = {}): string | null => {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;
                const match = line.match(label);
                if (match) {
                    let val = line.substring(line.indexOf(match[0]) + match[0].length).trim();
                    val = val.replace(/^[:\.\-\s\\|]+/, '').trim();

                    if ((!val || val.length < 2) && options.nextLine && i + 1 < lines.length) {
                        val = lines[i + 1].trim();
                    }

                    if (options.stop) val = val.split(options.stop)[0].trim();
                    if (options.pattern) {
                        const m = val.match(options.pattern);
                        if (m) val = m[0];
                    }

                    // Final cleanup
                    val = val.replace(/\s+(?:jt|GR|No|REF|Yes|No|STATE|CODE|GSTIN|DA).*$/i, '').trim();
                    val = val.replace(/[«»|()_]/g, '').trim();
                    return val.length > 2 ? val : null;
                }
            }
            return null;
        };

        // NAME heuristic: look for line between RECEIVER and ADDRESS if NAME label is missing
        let name = getValue(/NAME/i, { stop: /ADDRESS/i });
        if (!name) {
            const receiverIdx = lines.findIndex(l => l.includes('RECEIVER'));
            const addressIdx = lines.findIndex(l => l.includes('ADDRESS'));
            if (receiverIdx !== -1 && addressIdx !== -1 && addressIdx > receiverIdx + 1) {
                // Take the line(s) in between
                name = lines.slice(receiverIdx + 1, addressIdx).join(' ').trim();
                name = name.split(/INVOICE|DATE/i)[0].trim();
            }
        }

        const data: ExtractedInward = {
            'NAME': name,
            'ADDRESS': getValue(/ADDRESS/i, { stop: /STATE|KARNATAKA|TAMILNADU|GSTIN/i }),
            'ADDRESS OF DELIVERY': getValue(/ADDRESS OF DELIVERY/i, { nextLine: true, stop: /FROM|INSURANCE|TRANSPORT/i }) ||
                getValue(/SHIP TO/i, { nextLine: true, stop: /FROM|INSURANCE|TRANSPORT/i }),
            'INVOICE NO': getValue(/INVOICE NO/i, { pattern: /[A-Z0-9]{8,12}/ }) || getValue(/INVOICE/i, { pattern: /[A-Z0-9]{8,12}/ }),
            'DATE': getValue(/DATE/i, { pattern: /\d{1,2}[-\/][A-Za-z0-9]{3}[-\/]\d{2,4}/ }),
            'PLACE OF SUPPLY': getValue(/PLACE OF SUPPLY/i, { stop: /WHETHER/i }),
            'DA NUMBER': getValue(/DA NUMBER/i, { nextLine: true, pattern: /\d{6}/ }),
            'DA DATE': getValue(/DA DATE/i, { pattern: /\d{1,2}[-\/][A-Za-z0-9]{3}[-\/]\d{2,4}/ }),
            'MODE OF DISPATCH': getValue(/MODE OF DISPATCH/i, { stop: /WAY/i }) || getValue(/MODE/i),
            'TRANSPORTER': getValue(/TRANSPORTER/i, { stop: /FROM|POLICY/i }),
            'FROM': getValue(/FROM/i, { stop: /TO|INSURANCE/i }),
            'TO': getValue(/TO/i, { stop: /MODEL|QTY/i }),
            'INSURANCE CO': getValue(/INSURANCE CO/i, { stop: /POLICY|VEHICLE/i }),
            'POLICY NO': getValue(/POLICY NO/i),
            'VEHICLE NO': getValue(/VEHICLE NO/i),
            'VEHICLES': []
        };

        let insideTable = false;
        let currentModel = '';
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.includes('Chassis No.') || (trimmed.includes('Chassis') && trimmed.includes('No.'))) {
                insideTable = true;
                continue;
            }
            if (insideTable && (trimmed.includes('Total') || trimmed.includes('FOR INDIA') || trimmed.includes('Authorized') || (trimmed.length < 5 && !trimmed.match(/[A-Z0-9]{10,}/)))) {
                if (!trimmed.match(/[A-Z0-9]{10,}/)) { // stop if line doesn't look like chassis
                    insideTable = false;
                }
                continue;
            }

            if (insideTable) {
                const chassisMatch = trimmed.match(/[A-Z0-9]{10,}[A-Z0-9]{5,}/);
                if (chassisMatch) {
                    const rawChassis = chassisMatch[0];
                    const chassisNo = rawChassis.replace(/[^A-Z0-9]/g, '').slice(-17);
                    if (chassisNo.length === 17) {
                        const tokens = trimmed.split(/\s+/).filter(t => t.length > 0);
                        const chassisTokenIdx = tokens.findIndex(t => t.includes(rawChassis));
                        let foundModel = '';
                        for (let i = 0; i < Math.max(0, chassisTokenIdx); i++) {
                            const t = tokens[i].replace(/[^A-Z0-9\-]/g, '');
                            if (t.length >= 6 && /[A-Z]/.test(t) && !t.includes(chassisNo)) {
                                foundModel = t;
                                break;
                            }
                        }
                        if (foundModel) currentModel = foundModel;
                        let engineNo = (chassisTokenIdx !== -1 && tokens[chassisTokenIdx + 1])
                            ? tokens[chassisTokenIdx + 1].replace(/[^A-Z0-9]/g, '')
                            : null;
                        const colorToken = tokens[tokens.length - 1];
                        const colorCode = colorToken ? colorToken.replace(/[^A-Z0-9]/g, '') : null;

                        const dateToken = tokens.find(t => t.match(/^\d{2}\/\d{4}$/) || t.match(/^\d{2}\/\d{2}\/\d{4}$/));
                        let mfgDate: Date | null = null;
                        if (dateToken) {
                            const parts = dateToken.split('/');
                            if (parts.length === 2) {
                                mfgDate = new Date(parseInt(parts[1]), parseInt(parts[0]) - 1, 1);
                            } else if (parts.length === 3) {
                                mfgDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                            }
                        } else {
                            // Fallback to chassis 10th char if no date token found
                            const yearCode = chassisNo.charAt(9);
                            const yearMap: Record<string, number> = {
                                'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020,
                                'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025, 'T': 2026
                            };
                            if (yearMap[yearCode]) {
                                mfgDate = new Date(yearMap[yearCode], 0, 1);
                            }
                        }

                        data['VEHICLES'].push({
                            modelCode: currentModel || 'UNKNOWN',
                            productName: null,
                            qty: 1,
                            chassisNo: chassisNo,
                            engineNo: engineNo,
                            colorCode: colorCode,
                            mfgDate: mfgDate
                        });
                    }
                }
            }
        }
        return data;
    }

    static async createHierarchical(data: any, createdById?: string, branchId?: string) {
        const generatedInwardNo = await IdGeneratorService.generateNextId('VPI', branchId);
        const isMapped = !!data.dealerName;

        const invoiceNo = isMapped ? data.invoiceNo : data['INVOICE NO'];
        if (invoiceNo) {
            const existingRecord = await (prisma as any).vehicleStockInward.findFirst({
                where: { invoiceNo }
            });
            if (existingRecord) {
                throw new Error(`Inward record with invoice number "${invoiceNo}" already exists`);
            }
        }

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

        // Attempt to find a matching dealer by name to set dealerId
        const dealerName = (inwardData as any).dealerName;
        let dealer = null;
        if (dealerName && dealerName !== 'UNKNOWN') {
            dealer = await (prisma as any).dealer.findFirst({
                where: { name: { contains: dealerName.trim(), mode: 'insensitive' } }
            });

            if (!dealer) {
                throw new Error(`Dealer "${dealerName}" not found in Dealer Master. Please create the dealer first.`);
            }
        }
        const dealerIdToSet = dealer?.id;

        const vehicles: VehicleRow[] = isMapped
            ? (data.vehicles || [])
            : (data['VEHICLES'] || []);

        const groupedVehicles = vehicles.reduce((groups: any, vehicle: VehicleRow) => {
            const colorCode = vehicle.colorCode || 'UNKNOWN';
            const key = `${vehicle.modelCode}_${colorCode}`;
            if (!groups[key]) {
                groups[key] = {
                    modelCode: vehicle.modelCode,
                    colorCode: colorCode,
                    qty: 0,
                    vehicles: []
                };
            }
            groups[key].qty += (Number(vehicle.qty) || 1);
            groups[key].vehicles.push({
                chassisNo: vehicle.chassisNo,
                engineNo: vehicle.engineNo,
                colorCode: vehicle.colorCode,
                mfgDate: vehicle.mfgDate
            });
            return groups;
        }, {});

        const lineItemsToCreate = await Promise.all(
            Object.values(groupedVehicles).map(async (group: any) => {
                let vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                    where: { modelCode: group.modelCode },
                });

                if (!vehicleMaster && group.modelCode.includes('-')) {
                    const baseModelCode = group.modelCode.split('-')[0];
                    vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                        where: { modelCode: baseModelCode }
                    });
                }

                const individualVehicles = await Promise.all(
                    group.vehicles.map(async (vehicle: any) => {
                        const colorImage = vehicleMaster && vehicle.colorCode
                            ? await (prisma as any).image.findFirst({
                                where: { code: vehicle.colorCode, vehicleMasterId: vehicleMaster.id },
                            })
                            : null;

                        // Decode MFG Date if not present
                        let mfgDate = vehicle.mfgDate;
                        const manufacturerId = data.manufacturerId || 'ck8g6k0a249el0880cmkbpizm';
                        if (!mfgDate && vehicle.chassisNo) {
                            mfgDate = await FrameNumberService.decodeChassisNo(vehicle.chassisNo, manufacturerId);
                        }

                        return {
                            chassisNo: vehicle.chassisNo,
                            engineNo: vehicle.engineNo,
                            colorCode: vehicle.colorCode,
                            imageId: colorImage?.id,
                            mfgDate: mfgDate
                        };
                    })
                );

                return {
                    modelCode: group.modelCode,
                    qty: group.qty,
                    vehicleMasterId: vehicleMaster?.id,
                    vehicles: { create: individualVehicles }
                };
            })
        );

        return (prisma as any).vehicleStockInward.create({
            data: {
                ...inwardData,
                dealerId: dealerIdToSet,
                inwardNo: generatedInwardNo || inwardData.invoiceNo,
                date: inwardData.date ? new Date(inwardData.date) : null,
                daDate: inwardData.daDate ? new Date(inwardData.daDate) : null,
                totalVehicles: vehicles.length,
                createdById,
                branchId,
                lineItems: { create: lineItemsToCreate },
            },
            include: {
                lineItems: {
                    include: {
                        vehicleMaster: true,
                        vehicles: {
                            include: { image: true }
                        }
                    }
                }
            },
        });
    }

    static async create(data: any, createdById?: string, branchId?: string) {
        return this.createHierarchical(data, createdById, branchId);
    }

    static transformHierarchicalToFlat(hierarchicalData: any) {
        if (!hierarchicalData.lineItems) {
            return {
                ...hierarchicalData,
                VEHICLES: hierarchicalData.items?.map((item: any) => ({
                    modelCode: item.vehicleMaster?.modelCode || '',
                    qty: 1,
                    chassisNo: item.chassisNo || '',
                    engineNo: item.engineNo || '',
                    colorCode: item.image?.code || ''
                })) || []
            };
        }

        const vehicles: any[] = [];
        hierarchicalData.lineItems.forEach((lineItem: any) => {
            lineItem.vehicles.forEach((vehicle: any) => {
                vehicles.push({
                    modelCode: lineItem.modelCode,
                    qty: lineItem.qty,
                    chassisNo: vehicle.chassisNo,
                    engineNo: vehicle.engineNo,
                    colorCode: vehicle.colorCode,
                    imageUrl: vehicle.image?.url || undefined
                });
            });
        });

        return {
            ...hierarchicalData,
            VEHICLES: vehicles
        };
    }

    static async getAll(query: any) {
        const { branchId } = query;
        try {
            const records = await (prisma as any).vehicleStockInward.findMany({
                where: branchId ? { branchId } : {},
                include: {
                    items: { include: { vehicleMaster: true, image: true } },
                    lineItems: {
                        include: {
                            vehicleMaster: true,
                            vehicles: {
                                include: { image: true }
                            }
                        }
                    },
                    createdBy: true
                },
                orderBy: { createdAt: 'desc' },
            });
            return records.map((record: any) => this.transformHierarchicalToFlat(record));
        } catch (error: any) {
            console.log('[VehicleStockInwardService] Using legacy getAll due to:', error.message);
            const records = await (prisma as any).vehicleStockInward.findMany({
                where: branchId ? { branchId } : {},
                include: {
                    items: { include: { vehicleMaster: true, image: true } },
                    createdBy: true
                },
                orderBy: { createdAt: 'desc' },
            });
            return records.map((record: any) => this.transformHierarchicalToFlat(record));
        }
    }

    static async getById(id: string) {
        const record = await (prisma as any).vehicleStockInward.findUnique({
            where: { id },
            include: {
                items: { include: { vehicleMaster: true, image: true } },
                lineItems: {
                    include: {
                        vehicleMaster: true,
                        vehicles: {
                            include: { image: true }
                        }
                    }
                },
                manufacturer: true,
                createdBy: true,
            },
        });
        if (!record) return null;
        return this.transformHierarchicalToFlat(record);
    }

    static async update(id: string, data: any) {
        const { vehicles, ...inwardData } = data;
        if (inwardData.addressOfDelivery) {
            inwardData.deliveryAddress = inwardData.addressOfDelivery;
            delete inwardData.addressOfDelivery;
        }
        return await this.updateHierarchical(id, inwardData, vehicles || []);
    }

    private static async updateHierarchical(id: string, inwardData: any, vehicles: VehicleRow[]) {
        const groupedVehicles = vehicles.reduce((groups: any, vehicle: VehicleRow) => {
            const colorCode = vehicle.colorCode || 'UNKNOWN';
            const key = `${vehicle.modelCode}_${colorCode}`;
            if (!groups[key]) {
                groups[key] = {
                    modelCode: vehicle.modelCode,
                    colorCode: colorCode,
                    qty: 0,
                    vehicles: []
                };
            }
            groups[key].qty += (Number(vehicle.qty) || 1);
            groups[key].vehicles.push({
                chassisNo: vehicle.chassisNo,
                engineNo: vehicle.engineNo,
                colorCode: vehicle.colorCode
            });
            return groups;
        }, {});

        // Attempt to find a matching dealer by name to set dealerId
        const dealerName = (inwardData as any).dealerName;
        let dealer = null;
        if (dealerName && dealerName !== 'UNKNOWN') {
            dealer = await (prisma as any).dealer.findFirst({
                where: { name: { contains: dealerName.trim(), mode: 'insensitive' } }
            });
            if (!dealer) {
                throw new Error(`Dealer "${dealerName}" not found in Dealer Master. Please create the dealer first.`);
            }
        }
        const dealerIdToSet = dealer?.id;

        const lineItemsToCreate = await Promise.all(
            Object.values(groupedVehicles).map(async (group: any) => {
                let vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                    where: { modelCode: group.modelCode },
                });
                if (!vehicleMaster && group.modelCode.includes('-')) {
                    const baseModelCode = group.modelCode.split('-')[0];
                    vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                        where: { modelCode: baseModelCode }
                    });
                }
                const individualVehicles = await Promise.all(
                    group.vehicles.map(async (vehicle: any) => {
                        const colorImage = vehicleMaster && vehicle.colorCode
                            ? await (prisma as any).image.findFirst({
                                where: { code: vehicle.colorCode, vehicleMasterId: vehicleMaster.id },
                            })
                            : null;

                        // Decode MFG Date if not present
                        let mfgDate = vehicle.mfgDate;
                        const manufacturerId = inwardData.manufacturerId || 'ck8g6k0a249el0880cmkbpizm';
                        if (!mfgDate && vehicle.chassisNo) {
                            mfgDate = await FrameNumberService.decodeChassisNo(vehicle.chassisNo, manufacturerId);
                        }

                        return {
                            chassisNo: vehicle.chassisNo,
                            engineNo: vehicle.engineNo,
                            colorCode: vehicle.colorCode,
                            imageId: colorImage?.id,
                            mfgDate: mfgDate
                        };
                    })
                );
                return {
                    modelCode: group.modelCode,
                    qty: group.qty,
                    vehicleMasterId: vehicleMaster?.id,
                    vehicles: { create: individualVehicles }
                };
            })
        );

        return await (prisma as any).$transaction(async (tx: any) => {
            await tx.individualVehicle.deleteMany({ where: { lineItem: { inwardId: id } } });
            await tx.inwardLineItem.deleteMany({ where: { inwardId: id } });
            await tx.vehicleStockItem.deleteMany({ where: { inwardId: id } });
            const updated = await tx.vehicleStockInward.update({
                where: { id },
                data: {
                    ...inwardData,
                    dealerId: dealerIdToSet,
                    date: inwardData.date ? new Date(inwardData.date) : null,
                    daDate: inwardData.daDate ? new Date(inwardData.daDate) : null,
                    totalVehicles: vehicles.length,
                    lineItems: { create: lineItemsToCreate }
                },
                include: {
                    lineItems: {
                        include: {
                            vehicleMaster: true,
                            vehicles: { include: { image: true } }
                        }
                    }
                }
            });
            return this.transformHierarchicalToFlat(updated);
        });
    }

    static async delete(id: string) {
        return await (prisma as any).$transaction(async (tx: any) => {
            await tx.individualVehicle.deleteMany({ where: { lineItem: { inwardId: id } } });
            await tx.inwardLineItem.deleteMany({ where: { inwardId: id } });
            await tx.vehicleStockItem.deleteMany({ where: { inwardId: id } });
            return tx.vehicleStockInward.delete({ where: { id } });
        });
    }

    static async lookupVehicleImage(modelCode: string, colorCode: string) {
        if (!modelCode || !colorCode) return null;
        try {
            let vehicleMaster = await (prisma as any).vehicleMaster.findFirst({ where: { modelCode } });
            if (!vehicleMaster && modelCode.includes('-')) {
                const baseModelCode = modelCode.split('-')[0];
                vehicleMaster = await (prisma as any).vehicleMaster.findFirst({ where: { modelCode: baseModelCode } });
            }
            if (!vehicleMaster) return null;
            const colorImage = await (prisma as any).image.findFirst({
                where: { code: colorCode, vehicleMasterId: vehicleMaster.id },
            });
            return colorImage?.url || null;
        } catch (error) {
            console.error('[VehicleStockInwardService] Error looking up image:', error);
            return null;
        }
    }

    private static async extractViaOCR(filePath: string): Promise<string> {
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'autoinn-ocr-'));
        const prefix = path.join(tempDir, 'page');
        try {
            console.log(`[VehicleStockInwardService] Converting PDF to PNG images in ${tempDir}...`);
            execSync(`pdftoppm -png -r 300 "${filePath}" "${prefix}"`);

            const files = await fs.readdir(tempDir);
            const images = files.filter(f => f.endsWith('.png')).sort();

            let combinedText = "";
            for (const img of images) {
                const imgPath = path.join(tempDir, img);
                console.log(`[VehicleStockInwardService] OCRing ${img}...`);

                // Try original and rotated if needed
                let pageText = await VehicleStockInwardService.ocrWithRotationRetry(imgPath);
                combinedText += pageText + "\n\n";
            }

            return combinedText;
        } catch (err) {
            console.error('[VehicleStockInwardService] OCR logic failed:', err);
            return "";
        } finally {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            } catch (cleanupErr) {
                console.error('[VehicleStockInwardService] OCR cleanup failed:', cleanupErr);
            }
        }
    }

    private static async ocrWithRotationRetry(imgPath: string): Promise<string> {
        // Try original first
        const result = await Tesseract.recognize(imgPath, 'eng');
        let text = result.data.text;

        if (text.includes('DISPATCH ADVICE')) return text;

        // Try rotating matches
        const rotations = [90, 180, 270];
        for (const degrees of rotations) {
            console.log(`[VehicleStockInwardService] "DISPATCH ADVICE" not found. Retrying with ${degrees} degree rotation...`);
            const rotatedPath = imgPath.replace('.png', `_rot${degrees}.png`);
            execSync(`convert "${imgPath}" -rotate ${degrees} "${rotatedPath}"`);

            const rotResult = await Tesseract.recognize(rotatedPath, 'eng');
            if (rotResult.data.text.includes('DISPATCH ADVICE') || rotResult.data.text.includes('YAMAHA')) {
                console.log(`[VehicleStockInwardService] Header found with ${degrees} degree rotation!`);
                return rotResult.data.text;
            }
            // Keep the best text just in case
            if (rotResult.data.text.length > text.length) text = rotResult.data.text;
        }
        return text;
    }
}