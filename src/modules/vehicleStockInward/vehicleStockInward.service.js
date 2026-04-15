import prisma from '../../utils/prisma.js';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { createWorker } from 'tesseract.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default ?? pdfParseLib;
// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────
export class VehicleStockInwardService {
    // ──────────────────────────────────────────────────────────────────────────
    // processPdf — Insurance-style PDF parsing with text extraction and OCR fallback
    // ──────────────────────────────────────────────────────────────────────────
    static async processPdf(filePath) {
        console.log(`[VehicleStockInwardService] processPdf called for: ${filePath}`);
        let text = '';
        try {
            const buffer = await fs.readFile(filePath);
            const data = await pdfParse(buffer);
            text = data.text?.trim() || '';
            console.log('[VehicleStockInwardService] Text extraction successful, length:', text.length);
        }
        catch (error) {
            console.log('[VehicleStockInwardService] Text extraction failed:', error);
        }
        // KEY CHANGE: fall through to OCR if text is empty, not only on exception
        if (!text) {
            console.log('[VehicleStockInwardService] Text is empty, trying OCR...');
            try {
                text = await this.extractTextWithOCR(filePath);
            }
            catch (ocrError) {
                console.error('[VehicleStockInwardService] OCR also failed:', ocrError);
            }
        }
        console.log('==================== RAW TEXT ====================');
        console.log(text);
        console.log('==================================================');
        const extractedData = this.extractDataFromText(text);
        console.log('==================== FETCHED PDF DATA ====================');
        console.log(JSON.stringify(extractedData, null, 2));
        console.log('==========================================================');
        return extractedData;
    }
    // ──────────────────────────────────────────────────────────────────────────
    // extractTextWithOCR — OCR fallback for image-based PDFs
    // ──────────────────────────────────────────────────────────────────────────
    static async extractTextWithOCR(filePath) {
        const tempDir = path.dirname(filePath);
        const uniqueId = path.basename(filePath);
        // FIX: ensure the file has a .pdf extension for pdftoppm
        const pdfPath = filePath.endsWith('.pdf') ? filePath : `${filePath}.pdf`;
        if (!filePath.endsWith('.pdf')) {
            await fs.copyFile(filePath, pdfPath);
            console.log(`[VehicleStockInwardService] Copied to: ${pdfPath}`);
        }
        const prefix = path.join(tempDir, `${uniqueId}_page`);
        try {
            // ── Step 1: High-DPI conversion (300 DPI makes a huge difference for scans)
            try {
                execSync(`pdftoppm -png -r 300 "${pdfPath}" "${prefix}"`, { stdio: 'pipe' });
                console.log('[VehicleStockInwardService] pdftoppm 300dpi succeeded');
            }
            catch (e) {
                console.error('[VehicleStockInwardService] pdftoppm failed:', e.stderr?.toString() || e.message);
                throw e;
            }
            // ── Step 2: Collect page images
            const allFiles = await fs.readdir(tempDir);
            const pageFiles = allFiles
                .filter(f => f.startsWith(`${uniqueId}_page-`) && f.endsWith('.png'))
                .sort();
            if (pageFiles.length === 0)
                throw new Error('pdftoppm produced no images');
            console.log(`[VehicleStockInwardService] Found ${pageFiles.length} page(s)`);
            // ── Step 3: Preprocess each page with ImageMagick then OCR
            const worker = await createWorker('eng');
            await worker.setParameters({
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/:.,()',
                preserve_interword_spaces: '1',
            });
            let fullText = '';
            for (const pageFile of pageFiles) {
                const imgPath = path.join(tempDir, pageFile);
                const processedPath = `${path.join(tempDir, pageFile)}_processed.png`;
                try {
                    // ImageMagick: deskew + grayscale + sharpen + threshold for clean OCR
                    execSync(`convert "${imgPath}" -deskew 40% -colorspace Gray -sharpen 0x1 -threshold 50% "${processedPath}"`, { stdio: 'pipe' });
                    console.log(`[VehicleStockInwardService] Preprocessed: ${pageFile}`);
                }
                catch {
                    // If ImageMagick not available, use original
                    console.warn('[VehicleStockInwardService] ImageMagick not available, using raw image');
                    await fs.copyFile(imgPath, processedPath);
                }
                const { data: { text } } = await worker.recognize(processedPath);
                fullText += text + '\n';
                try {
                    await fs.unlink(imgPath);
                }
                catch { }
                try {
                    await fs.unlink(processedPath);
                }
                catch { }
            }
            await worker.terminate();
            if (!filePath.endsWith('.pdf')) {
                try {
                    await fs.unlink(pdfPath);
                }
                catch { }
            }
            console.log(`[VehicleStockInwardService] OCR done. Text length: ${fullText.length}`);
            return fullText;
        }
        catch (error) {
            console.error('[VehicleStockInwardService] OCR extraction failed:', error);
            throw new Error('Failed to extract text from PDF');
        }
    }
    // ──────────────────────────────────────────────────────────────────────────
    // extractDataFromText — Regex-based data extraction from PDF text
    // ──────────────────────────────────────────────────────────────────────────
    static extractDataFromText(text) {
        const extractedData = {
            'NAME': null,
            'ADDRESS': null,
            'ADDRESS OF DELIVERY': null,
            'INVOICE NO': null,
            'DATE': null,
            'PLACE OF SUPPLY': null,
            'DA NUMBER': null,
            'DA DATE': null,
            'MODE OF DISPATCH': null,
            'TRANSPORTER': null,
            'FROM': null,
            'TO': null,
            'INSURANCE CO': null,
            'POLICY NO': null,
            'VEHICLE NO': null,
            'VEHICLES': []
        };
        // More flexible regex patterns for Yamaha Dispatch Advice PDFs
        // Dealer Name - multiple patterns
        let nameMatch = text.match(/DETAILS OF RECEIVER\s*\(BILLED TO\)[\s\S]*?NAME[:\s]*([^\n]+)/i);
        if (!nameMatch)
            nameMatch = text.match(/NAME[:\s]*([^\n]+)/i);
        if (!nameMatch)
            nameMatch = text.match(/BILLED TO\s*[:\s]*([^\n]+)/i);
        if (nameMatch && nameMatch[1]) {
            extractedData['NAME'] = nameMatch[1].trim();
        }
        // Billing Address - multiple patterns
        let addressMatch = text.match(/DETAILS OF RECEIVER\s*\(BILLED TO\)[\s\S]*?ADDRESS[:\s]*([^\n]+)/i);
        if (!addressMatch)
            addressMatch = text.match(/ADDRESS[:\s]*([^\n]+)/i);
        if (addressMatch && addressMatch[1]) {
            extractedData['ADDRESS'] = addressMatch[1].trim();
        }
        // Delivery Address - multiple patterns
        let deliveryAddressMatch = text.match(/ADDRESS OF DELIVERY\s*\(SHIP TO\)[:\s]*([^\n]+)/i);
        if (!deliveryAddressMatch)
            deliveryAddressMatch = text.match(/SHIP TO[:\s]*([^\n]+)/i);
        if (deliveryAddressMatch && deliveryAddressMatch[1]) {
            extractedData['ADDRESS OF DELIVERY'] = deliveryAddressMatch[1].trim();
        }
        // Invoice Number - multiple patterns
        let invoiceMatch = text.match(/INVOICE\s*NO[:\s]*([A-Z0-9]+)/i);
        if (!invoiceMatch)
            invoiceMatch = text.match(/INVOICE\s*NUMBER[:\s]*([A-Z0-9]+)/i);
        if (!invoiceMatch)
            invoiceMatch = text.match(/INVOICE[:\s]*([A-Z0-9]+)/i);
        if (invoiceMatch && invoiceMatch[1]) {
            extractedData['INVOICE NO'] = invoiceMatch[1].trim();
        }
        // Date - multiple patterns
        let dateMatch = text.match(/DATE[:\s]*([0-9]{1,2}[-][A-Za-z]{3}[-][0-9]{4})/i);
        if (!dateMatch)
            dateMatch = text.match(/([0-9]{1,2}[-][A-Za-z]{3}[-][0-9]{4})/i);
        if (dateMatch && dateMatch[1]) {
            extractedData['DATE'] = dateMatch[1].trim();
        }
        // Place of Supply
        const placeMatch = text.match(/PLACE OF SUPPLY[:\s]*([^\n]+)/i);
        if (placeMatch && placeMatch[1]) {
            extractedData['PLACE OF SUPPLY'] = placeMatch[1].trim();
        }
        // DA Number - multiple patterns
        let daNumberMatch = text.match(/DA\s*NUMBER[:\s]*([0-9]+)/i);
        if (!daNumberMatch)
            daNumberMatch = text.match(/DA\s*NO[:\s]*([0-9]+)/i);
        if (daNumberMatch && daNumberMatch[1]) {
            extractedData['DA NUMBER'] = daNumberMatch[1].trim();
        }
        // DA Date - multiple patterns
        let daDateMatch = text.match(/DA\s*DATE[:\s]*([0-9]{1,2}[-][A-Za-z]{3}[-][0-9]{4})/i);
        if (!daDateMatch)
            daDateMatch = text.match(/DA\s*DATE[:\s]*([0-9]{1,2}[-][A-Za-z]{3}[-][0-9]{4})/i);
        if (daDateMatch && daDateMatch[1]) {
            extractedData['DA DATE'] = daDateMatch[1].trim();
        }
        // Mode of Dispatch - multiple patterns
        let modeMatch = text.match(/MODE OF DISPATCH[:\s]*([^\n]+)/i);
        if (!modeMatch)
            modeMatch = text.match(/DISPATCH[:\s]*([^\n]+)/i);
        if (modeMatch && modeMatch[1]) {
            extractedData['MODE OF DISPATCH'] = modeMatch[1].trim();
        }
        // Transporter - multiple patterns
        let transporterMatch = text.match(/TRANSPORTER[:\s]*([^\n]+)/i);
        if (!transporterMatch)
            transporterMatch = text.match(/TRANSPORT[:\s]*([^\n]+)/i);
        if (transporterMatch && transporterMatch[1]) {
            extractedData['TRANSPORTER'] = transporterMatch[1].trim();
        }
        // From location
        const fromMatch = text.match(/FROM[:\s]*([^\n]+)/i);
        if (fromMatch && fromMatch[1]) {
            extractedData['FROM'] = fromMatch[1].trim();
        }
        // To location
        const toMatch = text.match(/TO[:\s]*([^\n]+)/i);
        if (toMatch && toMatch[1]) {
            extractedData['TO'] = toMatch[1].trim();
        }
        // Insurance Company - multiple patterns
        let insuranceMatch = text.match(/INSURANCE\s*CO[:\s]*([^\n]+)/i);
        if (!insuranceMatch)
            insuranceMatch = text.match(/INSURANCE\s*COMPANY[:\s]*([^\n]+)/i);
        if (insuranceMatch && insuranceMatch[1]) {
            extractedData['INSURANCE CO'] = insuranceMatch[1].trim();
        }
        // Policy Number - multiple patterns
        let policyMatch = text.match(/POLICY\s*NO[:\s]*([A-Z0-9\/\-]+)/i);
        if (!policyMatch)
            policyMatch = text.match(/POLICY\s*NUMBER[:\s]*([A-Z0-9\/\-]+)/i);
        if (policyMatch && policyMatch[1]) {
            extractedData['POLICY NO'] = policyMatch[1].trim();
        }
        // Vehicle Number - multiple patterns
        let vehicleNoMatch = text.match(/VEHICLE\s*NO[:\s]*([A-Z0-9\-]+)/i);
        if (!vehicleNoMatch)
            vehicleNoMatch = text.match(/VEHICLE\s*NUMBER[:\s]*([A-Z0-9\-]+)/i);
        if (vehicleNoMatch && vehicleNoMatch[1]) {
            extractedData['VEHICLE NO'] = vehicleNoMatch[1].trim();
        }
        // Extract vehicle table data
        extractedData['VEHICLES'] = this.extractVehicleTable(text);
        return extractedData;
    }
    // ──────────────────────────────────────────────────────────────────────────
    // extractVehicleTable — Extract vehicle information from table
    // ──────────────────────────────────────────────────────────────────────────
    static extractVehicleTable(text) {
        const vehicles = [];
        // Try each pattern
        const patterns = [
            /([A-Z]{2}[A-Z0-9]{2,4}-\d{3}[A-Z])\s+(\d+)\s+(\d+)\s+([A-Z0-9]{15,20})\s+([A-Z0-9]+)\s+([A-Z0-9]+)/gi,
            /([A-Z]{2}[A-Z0-9]{2,4}-\d{3}[A-Z])\s+(\d+)\s+([A-Z0-9]{15,20})\s+([A-Z0-9]+)\s+([A-Z0-9]+)/gi,
            /([A-Z]{2}[A-Z0-9]{2,4}-\d{3}[A-Z]).*?([A-Z0-9]{17})/gi
        ];
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                let modelCode, qty, chassisNo, engineNo, colorCode;
                if (match.length >= 6) {
                    // Full match: model, qty, rowNo, chassis, engine, color
                    [, modelCode, qty, , chassisNo, engineNo, colorCode] = match;
                }
                else if (match.length >= 3) {
                    // Partial match: model and chassis
                    [, modelCode, chassisNo] = match;
                    qty = '1';
                    engineNo = '';
                    colorCode = '';
                }
                if (modelCode && chassisNo) {
                    vehicles.push({
                        modelCode: modelCode.trim(),
                        productName: null,
                        qty: parseInt(qty || '1') || 1,
                        chassisNo: chassisNo.trim().substring(0, 17), // Ensure 17 chars
                        engineNo: engineNo?.trim() || '',
                        colorCode: colorCode?.trim() || ''
                    });
                }
            }
            if (vehicles.length > 0)
                break; // Stop if we found vehicles
        }
        // If regex doesn't work, try alternative approach for table extraction
        if (vehicles.length === 0) {
            return this.extractVehicleTableAlternative(text);
        }
        return vehicles;
    }
    // ──────────────────────────────────────────────────────────────────────────
    // extractVehicleTableAlternative — Fallback method for vehicle table extraction
    // ──────────────────────────────────────────────────────────────────────────
    static extractVehicleTableAlternative(text) {
        const vehicles = [];
        // Look for chassis numbers (17 characters) and extract surrounding context
        const chassisPattern = /\b([A-Z0-9]{17})\b/g;
        const lines = text.split('\n');
        for (const line of lines) {
            const chassisMatch = line.match(chassisPattern);
            if (chassisMatch) {
                // Try to extract other information from the same line
                const parts = line.split(/\s+/);
                const chassisIndex = parts.findIndex(part => part.length === 17 && /^[A-Z0-9]+$/.test(part));
                if (chassisIndex > 0) {
                    const modelCode = parts[chassisIndex - 3] || '';
                    const qtyStr = parts[chassisIndex - 2] || '1';
                    const engineNo = parts[chassisIndex + 1] || '';
                    const colorCode = parts[chassisIndex + 2] || '';
                    // Validate model code pattern
                    if (/^[A-Z]{2}[A-Z0-9]{2,4}-\d{3}[A-Z]$/.test(modelCode)) {
                        vehicles.push({
                            modelCode,
                            productName: null,
                            qty: parseInt(qtyStr) || 1,
                            chassisNo: chassisMatch[0],
                            engineNo,
                            colorCode
                        });
                    }
                }
            }
        }
        return vehicles;
    }
    // ──────────────────────────────────────────────────────────────────────────
    // create — persist to database
    // ──────────────────────────────────────────────────────────────────────────
    static async create(data, createdById, branchId) {
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
        const vehicles = isMapped
            ? (data.vehicles || [])
            : (data['VEHICLES'] || []);
        const itemsToCreate = await Promise.all(vehicles.map(async (v) => {
            const vehicleMaster = await prisma.vehicleMaster.findFirst({
                where: { modelCode: v.modelCode },
            });
            const colorImage = vehicleMaster && v.colorCode
                ? await prisma.image.findFirst({
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
        return prisma.vehicleStockInward.create({
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
    static async getAll(query) {
        const { branchId } = query;
        return prisma.vehicleStockInward.findMany({
            where: branchId ? { branchId } : {},
            include: {
                items: { include: { vehicleMaster: true, image: true } },
                createdBy: true
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getById(id) {
        return prisma.vehicleStockInward.findUnique({
            where: { id },
            include: {
                items: { include: { vehicleMaster: true, image: true } },
                manufacturer: true,
                createdBy: true,
            },
        });
    }
    static async update(id, data) {
        const { vehicles, ...inwardData } = data;
        // Ensure deliveryAddress is mapped if it comes as addressOfDelivery
        if (inwardData.addressOfDelivery) {
            inwardData.deliveryAddress = inwardData.addressOfDelivery;
            delete inwardData.addressOfDelivery;
        }
        const itemsToUpdate = await Promise.all((vehicles || []).map(async (v) => {
            const vehicleMaster = await prisma.vehicleMaster.findFirst({
                where: { modelCode: v.modelCode },
            });
            const colorImage = vehicleMaster && v.colorCode
                ? await prisma.image.findFirst({
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
        return await prisma.$transaction(async (tx) => {
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
    static async delete(id) {
        return await prisma.$transaction(async (tx) => {
            await tx.vehicleStockItem.deleteMany({
                where: { inwardId: id }
            });
            return tx.vehicleStockInward.delete({
                where: { id }
            });
        });
    }
}
//# sourceMappingURL=vehicleStockInward.service.js.map