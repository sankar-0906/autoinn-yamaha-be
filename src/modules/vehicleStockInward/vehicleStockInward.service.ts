import prisma from '../../utils/prisma.js';
import { createWorker } from 'tesseract.js';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { promisify } from 'util';

const execPromise = promisify(exec);

export class VehicleStockInwardService {
    static async processPdf(filePath: string) {
        console.log(`[VehicleStockInwardService] processPdf called for file: ${filePath}`);
        try {
            const outputDir = path.dirname(filePath);
            const fileName = path.basename(filePath, path.extname(filePath));
            const outputBase = path.join(outputDir, fileName);

            console.log(`[VehicleStockInwardService] Converting PDF to images using pdftoppm. Output base: ${outputBase}`);
            // Convert PDF to images using pdftoppm
            const convertCmd = `pdftoppm -png "${filePath}" "${outputBase}"`;
            console.log(`[VehicleStockInwardService] Executing: ${convertCmd}`);

            try {
                const { stdout, stderr } = await execPromise(convertCmd);
                if (stderr) console.warn(`[VehicleStockInwardService] pdftoppm stderr: ${stderr}`);
                console.log(`[VehicleStockInwardService] pdftoppm completed successfully`);
            } catch (execError: any) {
                console.error(`[VehicleStockInwardService] pdftoppm failed: ${execError.message}`);
                throw new Error(`Failed to convert PDF to images: ${execError.message}`);
            }

            // Find all generated images
            const files = await fs.readdir(outputDir);
            const imageFiles = files
                .filter(f => f.startsWith(fileName + '-') && f.endsWith('.png'))
                .sort()
                .map(f => path.join(outputDir, f));

            console.log(`[VehicleStockInwardService] Found ${imageFiles.length} images to process`);

            if (imageFiles.length === 0) {
                console.warn(`[VehicleStockInwardService] No images found after pdftoppm conversion`);
            }

            let fullText = '';
            console.log(`[VehicleStockInwardService] Initializing Tesseract worker`);
            const worker = await createWorker('eng');

            for (let i = 0; i < imageFiles.length; i++) {
                const imageFile = imageFiles[i];
                if (!imageFile) continue;

                console.log(`[VehicleStockInwardService] Processing image ${i + 1}/${imageFiles.length}: ${imageFile}`);
                try {
                    const { data: { text } } = await worker.recognize(imageFile);
                    fullText += text + '\n--- PAGE BREAK ---\n';
                    console.log(`[VehicleStockInwardService] Completed OCR for image ${i + 1}. Text length: ${text.length} chars`);
                } catch (ocrError: any) {
                    console.error(`[VehicleStockInwardService] OCR failed for image ${i + 1}: ${ocrError.message}`);
                } finally {
                    // Cleanup image file
                    try {
                        await fs.unlink(imageFile);
                        console.log(`[VehicleStockInwardService] Cleaned up image file: ${imageFile}`);
                    } catch (unlinkError: any) {
                        console.warn(`[VehicleStockInwardService] Failed to unlink image file: ${unlinkError.message}`);
                    }
                }
            }

            await worker.terminate();
            console.log(`[VehicleStockInwardService] Tesseract worker terminated. Full text length: ${fullText.length} chars`);

            console.log(`[VehicleStockInwardService] Parsing extracted text`);
            const extractedData = this.parseExtractedText(fullText);
            console.log(`[VehicleStockInwardService] Extraction complete. Found ${extractedData.vehicles.length} vehicles.`);

            return extractedData;
        } catch (error: any) {
            console.error(`[VehicleStockInwardService] processPdf top-level error:`, error);
            throw error;
        }
    }

    private static parseExtractedText(text: string) {
        console.log('--- OCR EXTRACTED TEXT START ---');
        console.log(text);
        console.log('--- OCR EXTRACTED TEXT END ---');

        // Robust regex patterns based on the provided PDF format
        const getMatch = (regex: RegExp, label: string) => {
            const match = text.match(regex);
            const result = match && match[1] ? match[1].trim() : '';
            console.log(`[Regex Match] ${label}: ${result || 'NOT FOUND'} (Regex: ${regex})`);
            return result;
        };

        const dealerName = getMatch(/NAME\s+([^\n]+)/i, 'Dealer Name');
        const address = getMatch(/ADDRESS\s+([^\n]+(?:\n[^\n]+)?)\s+STATE/i, 'Address');
        const invoiceNo = getMatch(/INVOICE NO\.\s+([A-Z0-9]+)/i, 'Invoice No');
        const date = getMatch(/DATE\s+(\d{1,2}-[A-Za-z]+-\d{4})/i, 'Date');
        const placeOfSupply = getMatch(/PLACE OF SUPPLY\s+([^\n]+)/i, 'Place of Supply');
        const daNumber = getMatch(/DA NUMBER\s+(\d+)/i, 'DA Number');
        const daDate = getMatch(/DA DATE\s+(\d{1,2}-[A-Za-z]+-\d{4})/i, 'DA Date');
        const modeOfTransport = getMatch(/MODE OF DISPATCH\s+([^\n]+)/i, 'Mode of Transport');
        const transporter = getMatch(/TRANSPORTER:\s+([^\n]+)/i, 'Transporter');
        const policyNumber = getMatch(/POLICY NO:\s+([^\n]+)/i, 'Policy Number');
        const vehicleNo = getMatch(/VEHICLE NO:\s+([^\n]+)/i, 'Vehicle No');
        const fromLoc = getMatch(/FROM:\s+([^\s]+)/i, 'From');
        const toLoc = getMatch(/TO:\s+([^\s]+)/i, 'To');
        const insuranceCo = getMatch(/INSURANCE CO\s+([^\n]+)/i, 'Insurance Co');

        // Vehicle Table Parsing
        const vehicles: any[] = [];
        const vehicleRowRegex = /([A-Z0-9-]+)\s+(\d+)\s+(\d+)\s+([A-Z0-9]{17})\s+([A-Z0-9]+)\s+([A-Z0-9]+)/g;
        console.log(`[Regex Match] Searching for vehicles with regex: ${vehicleRowRegex}`);

        let vehicleMatch;
        let vehicleCount = 0;
        while ((vehicleMatch = vehicleRowRegex.exec(text)) !== null) {
            vehicleCount++;
            console.log(`[Regex Match] Found vehicle row ${vehicleCount}:`, vehicleMatch[0]);
            if (vehicleMatch[1] && vehicleMatch[2] && vehicleMatch[4] && vehicleMatch[5] && vehicleMatch[6]) {
                vehicles.push({
                    modelCode: vehicleMatch[1],
                    qty: parseInt(vehicleMatch[2]),
                    chassisNo: vehicleMatch[4],
                    engineNo: vehicleMatch[5],
                    colorCode: vehicleMatch[6]
                });
            } else {
                console.warn(`[Regex Match] Row ${vehicleCount} missing fields:`, {
                    modelCode: vehicleMatch[1],
                    qty: vehicleMatch[2],
                    chassisNo: vehicleMatch[4],
                    engineNo: vehicleMatch[5],
                    colorCode: vehicleMatch[6]
                });
            }
        }

        if (vehicleCount === 0) {
            console.warn('[Regex Match] NO VEHICLE ROWS FOUND IN TEXT');
        }

        return {
            dealerName,
            address,
            invoiceNo,
            date,
            placeOfSupply,
            daNumber,
            daDate,
            modeOfTransport,
            transporter,
            policyNumber,
            vehicleNo,
            from: fromLoc,
            to: toLoc,
            insuranceCo,
            vehicles
        };
    }

    static async create(data: any, createdById?: string, branchId?: string) {
        const { vehicles, ...inwardData } = data;

        // Perform mapping logic for Master Data
        const itemsToCreate = await Promise.all((vehicles || []).map(async (v: any) => {
            // Find Vehicle Master by modelCode
            const vehicleMaster = await (prisma as any).vehicleMaster.findFirst({
                where: { modelCode: v.modelCode }
            });

            // Find Color Image by colorCode and vehicleMasterId
            const colorImage = vehicleMaster ? await (prisma as any).image.findFirst({
                where: {
                    code: v.colorCode,
                    vehicleMasterId: vehicleMaster.id
                }
            }) : null;

            return {
                vehicleMasterId: vehicleMaster?.id,
                imageId: colorImage?.id,
                engineNo: v.engineNo,
                chassisNo: v.chassisNo
            };
        }));

        return (prisma as any).vehicleStockInward.create({
            data: {
                ...inwardData,
                date: inwardData.date ? new Date(inwardData.date) : null,
                daDate: inwardData.daDate ? new Date(inwardData.daDate) : null,
                createdById,
                branchId,
                items: {
                    create: itemsToCreate
                }
            },
            include: {
                items: true
            }
        });
    }

    static async getAll(query: any) {
        const { branchId } = query;
        return (prisma as any).vehicleStockInward.findMany({
            where: branchId ? { branchId } : {},
            include: {
                items: {
                    include: {
                        vehicleMaster: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getById(id: string) {
        return (prisma as any).vehicleStockInward.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        vehicleMaster: true,
                        image: true
                    }
                },
                manufacturer: true,
                createdBy: true
            }
        });
    }
}
