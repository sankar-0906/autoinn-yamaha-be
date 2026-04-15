import { Worker, Job } from 'bullmq';
import { connection } from '../../utils/queue.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const execPromise = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const pdfOcrWorker = new Worker('pdf-ocr', async (job) => {
    const { filePath } = job.data;
    const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    const pythonScriptPath = path.join(__dirname, 'ocr_extract.py');
    console.log(`[OCR Worker] Job ${job.id} started for: ${absoluteFilePath}`);
    try {
        // Execute Python script
        const { stdout, stderr } = await execPromise(`python3 "${pythonScriptPath}" "${absoluteFilePath}"`);
        if (stderr) {
            console.warn(`[OCR Worker] Python stderr: ${stderr}`);
        }
        const extractedText = stdout;
        console.log(`[OCR Worker] Job ${job.id} extraction complete. Text length: ${extractedText.length}`);
        // Cleanup original upload file after processing
        try {
            await fs.unlink(absoluteFilePath);
            console.log(`[OCR Worker] Original file cleaned up: ${absoluteFilePath}`);
        }
        catch (unlinkErr) {
            console.warn(`[OCR Worker] Failed to cleanup file: ${absoluteFilePath}`, unlinkErr);
        }
        return { text: extractedText };
    }
    catch (error) {
        console.error(`[OCR Worker] Job ${job.id} failed:`, error);
        throw error;
    }
}, { connection });
pdfOcrWorker.on('completed', (job) => {
    console.log(`[OCR Worker] Job ${job.id} completed!`);
});
pdfOcrWorker.on('failed', (job, err) => {
    console.error(`[OCR Worker] Job ${job?.id} failed with error: ${err.message}`);
});
//# sourceMappingURL=vehicleStockInward.worker.js.map