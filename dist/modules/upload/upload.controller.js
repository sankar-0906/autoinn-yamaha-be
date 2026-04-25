import { sendSuccess, sendError } from '../../utils/response.js';
export class UploadController {
    static async uploadImage(req, res) {
        try {
            const multerReq = req;
            if (!multerReq.file) {
                return sendError(res, 'No file uploaded', 400);
            }
            // In a real app, you might upload to S3 here.
            // For now, we return the local URL.
            const fileUrl = `${multerReq.protocol}://${multerReq.get('host')}/uploads/${multerReq.file.filename}`;
            return sendSuccess(res, 'File uploaded successfully', {
                url: fileUrl,
                filename: multerReq.file.filename,
                originalname: multerReq.file.originalname,
                mimetype: multerReq.file.mimetype,
                size: multerReq.file.size
            });
        }
        catch (error) {
            return sendError(res, error.message, 500);
        }
    }
}
