import type { Request, Response } from 'express';
import { VehicleStockInwardService } from './vehicleStockInward.service.js';
import { VehicleDataRecoveryService } from './vehicleStockInward.recovery.service.js';
import multer from 'multer';
import { handleApiError } from '../../utils/errorHandler.js';
import { jobCache } from '../../utils/jobCache.js';

interface MulterRequest extends Request {
    file?: any;
}

export class VehicleStockInwardController {
    static async processPdf(req: Request, res: Response) {
        const multerReq = req as MulterRequest;
        console.log('[VehicleStockInwardController] processPdf started');
        try {
            if (!multerReq.file) {
                console.error('[VehicleStockInwardController] No file uploaded');
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            console.log(`[VehicleStockInwardController] File received: ${multerReq.file.originalname}, Path: ${multerReq.file.path}, Size: ${multerReq.file.size} bytes`);

            // Create async job and respond immediately
            const jobId = jobCache.createJob();
            console.log(`[VehicleStockInwardController] Created job ${jobId} for PDF processing`);
            
            res.json({ success: true, jobId, status: 'processing' });

            // Process PDF in background
            VehicleStockInwardService.processPdf(multerReq.file.path)
                .then(data => {
                    console.log(`[VehicleStockInwardController] Job ${jobId} completed. Found ${data.VEHICLES.length} vehicles.`);
                    jobCache.setJobComplete(jobId, data);
                })
                .catch(error => {
                    console.error(`[VehicleStockInwardController] Job ${jobId} failed:`, error);
                    jobCache.setJobError(jobId, error.message || 'Unknown error occurred');
                });
        } catch (error: any) {
            console.error('[VehicleStockInwardController] Error starting PDF processing:', error);
            return handleApiError(res, error);
        }
    }

    static async getJobStatus(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).json({ success: false, message: 'Job ID is required' });
            }

            const job = jobCache.getJob(jobId);
            if (!job) {
                return res.json({ status: 'processing' }); // Job not found, assume still processing
            }

            res.json(job);
        } catch (error: any) {
            return handleApiError(res, error);
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const createdById = (req as any).user?.id;
            const branchId = (req as any).user?.branchId;

            // Try hierarchical creation first, fallback to legacy if not available
            let data;
            try {
                // Use hierarchical creation for new records (from PDF processing)
                // This preserves all original data including modelCode, qty, colorCode
                data = await VehicleStockInwardService.createHierarchical(req.body, createdById, branchId);
            } catch (hierarchicalError: any) {
                console.log('[VehicleStockInwardController] Falling back to legacy create due to:', hierarchicalError.message);
                // Fallback to legacy method
                data = await VehicleStockInwardService.create(req.body, createdById, branchId);
            }

            res.status(201).json({ success: true, data });
        } catch (error: any) {
            // Handle duplicate invoice number error specifically
            if (error.message && error.message.includes('already exists')) {
                return handleApiError(res, error);
            }
            return handleApiError(res, error);
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const branchId = (req as any).user?.branchId;
            const data = await VehicleStockInwardService.getAll({ branchId });
            res.json({ success: true, data });
        } catch (error: any) {
            return handleApiError(res, error);
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ success: false, message: 'ID is required' });
            }
            const data = await VehicleStockInwardService.getById(id);
            if (!data) {
                return res.status(404).json({ success: false, message: 'Record not found' });
            }
            res.json({ success: true, data });
        } catch (error: any) {
            return handleApiError(res, error);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
            const data = await VehicleStockInwardService.update(id, req.body);
            res.json({ success: true, data });
        } catch (error: any) {
            return handleApiError(res, error);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, message: 'ID is required' });
            await VehicleStockInwardService.delete(id);
            res.json({ success: true, message: 'Record deleted successfully' });
        } catch (error: any) {
            return handleApiError(res, error);
        }
    }

    static async recoverVehicleData(req: Request, res: Response) {
        try {
            const { vehicles } = req.body;

            if (!Array.isArray(vehicles)) {
                return res.status(400).json({
                    success: false,
                    message: 'Vehicles array is required'
                });
            }

            console.log(`[RECOVERY] Processing ${vehicles.length} vehicles for data recovery`);

            const recoveredVehicles = await VehicleDataRecoveryService.batchRecoverVehicleData(vehicles);

            res.json({
                success: true,
                data: recoveredVehicles,
                message: 'Vehicle data recovery completed'
            });
        } catch (error: any) {
            console.error('[RECOVERY] Error in vehicle data recovery:', error);
            return handleApiError(res, error);
        }
    }

    static async lookupVehicleImage(req: Request, res: Response) {
        try {
            const { modelCode, colorCode } = req.query;
            if (!modelCode || !colorCode) {
                return res.status(400).json({ success: false, message: 'modelCode and colorCode are required' });
            }
            const imageUrl = await VehicleStockInwardService.lookupVehicleImage(modelCode as string, colorCode as string);
            res.json({ success: true, data: imageUrl });
        } catch (error: any) {
            return handleApiError(res, error);
        }
    }
}
