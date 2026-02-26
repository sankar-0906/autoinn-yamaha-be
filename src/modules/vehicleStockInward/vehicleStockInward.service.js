import prisma from '../../utils/prisma.js';
import { createWorker } from 'tesseract.js';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { promisify } from 'util';
const execPromise = promisify(exec);
export class VehicleStockInwardService {
    static async processPdf(filePath) {
        const outputDir = path.dirname(filePath);
        const fileName = path.basename(filePath, path.extname(filePath));
        const outputBase = path.join(outputDir, fileName);
        // Convert PDF to images using pdftoppm
        await execPromise(`pdftoppm -png "${filePath}" "${outputBase}"`);
        // Find all generated images
        const files = await fs.readdir(outputDir);
        const imageFiles = files
            .filter(f => f.startsWith(fileName + '-') && f.endsWith('.png'))
            .sort()
            .map(f => path.join(outputDir, f));
        let fullText = '';
        const worker = await createWorker('eng');
        for (const imageFile of imageFiles) {
            const { data: { text } } = await worker.recognize(imageFile);
            fullText += text + '\n--- PAGE BREAK ---\n';
            // Cleanup image file
            await fs.unlink(imageFile);
        }
        await worker.terminate();
        const extractedData = this.parseExtractedText(fullText);
        return extractedData;
    }
    static parseExtractedText(text) {
        // Robust regex patterns based on the provided PDF format
        const getMatch = (regex) => {
            const match = text.match(regex);
            return match && match[1] ? match[1].trim() : '';
        };
        const dealerName = getMatch(/NAME\s+([^\n]+)/i);
        const address = getMatch(/ADDRESS\s+([^\n]+(?:\n[^\n]+)?)\s+STATE/i);
        const invoiceNo = getMatch(/INVOICE NO\.\s+([A-Z0-9]+)/i);
        const date = getMatch(/DATE\s+(\d{1,2}-[A-Za-z]+-\d{4})/i);
        const placeOfSupply = getMatch(/PLACE OF SUPPLY\s+([^\n]+)/i);
        const daNumber = getMatch(/DA NUMBER\s+(\d+)/i);
        const daDate = getMatch(/DA DATE\s+(\d{1,2}-[A-Za-z]+-\d{4})/i);
        const modeOfTransport = getMatch(/MODE OF DISPATCH\s+([^\n]+)/i);
        const transporter = getMatch(/TRANSPORTER:\s+([^\n]+)/i);
        const policyNumber = getMatch(/POLICY NO:\s+([^\n]+)/i);
        const vehicleNo = getMatch(/VEHICLE NO:\s+([^\n]+)/i);
        const fromLoc = getMatch(/FROM:\s+([^\s]+)/i);
        const toLoc = getMatch(/TO:\s+([^\s]+)/i);
        const insuranceCo = getMatch(/INSURANCE CO\s+([^\n]+)/i);
        // Vehicle Table Parsing
        const vehicles = [];
        const vehicleRowRegex = /([A-Z0-9-]+)\s+(\d+)\s+(\d+)\s+([A-Z0-9]{17})\s+([A-Z0-9]+)\s+([A-Z0-9]+)/g;
        let vehicleMatch;
        while ((vehicleMatch = vehicleRowRegex.exec(text)) !== null) {
            if (vehicleMatch[1] && vehicleMatch[2] && vehicleMatch[4] && vehicleMatch[5] && vehicleMatch[6]) {
                vehicles.push({
                    modelCode: vehicleMatch[1],
                    qty: parseInt(vehicleMatch[2]),
                    chassisNo: vehicleMatch[4],
                    engineNo: vehicleMatch[5],
                    colorCode: vehicleMatch[6]
                });
            }
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
    static async create(data, createdById, branchId) {
        const { vehicles, ...inwardData } = data;
        // Perform mapping logic for Master Data
        const itemsToCreate = await Promise.all((vehicles || []).map(async (v) => {
            // Find Vehicle Master by modelCode
            const vehicleMaster = await prisma.vehicleMaster.findFirst({
                where: { modelCode: v.modelCode }
            });
            // Find Color Image by colorCode and vehicleMasterId
            const colorImage = vehicleMaster ? await prisma.image.findFirst({
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
        return prisma.vehicleStockInward.create({
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
    static async getAll(query) {
        const { branchId } = query;
        return prisma.vehicleStockInward.findMany({
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
    static async getById(id) {
        return prisma.vehicleStockInward.findUnique({
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
//# sourceMappingURL=vehicleStockInward.service.js.map