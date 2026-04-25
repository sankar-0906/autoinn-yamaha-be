import { sendSuccess, sendError } from '../../utils/response.js';
export class UploadController {
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return sendError(res, 'No file uploaded', 400);
            }
            // In a real app, you might upload to S3 here.
            // For now, we return the local URL.
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            return sendSuccess(res, 'File uploaded successfully', {
                url: fileUrl,
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
        }
        catch (error) {
            return sendError(res, error.message, 500);
        }
    }
}
