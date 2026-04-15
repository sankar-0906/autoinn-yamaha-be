import { Worker } from 'bullmq';
export interface OcrJobData {
    filePath: string;
}
export declare const pdfOcrWorker: Worker<OcrJobData, any, string>;
//# sourceMappingURL=vehicleStockInward.worker.d.ts.map