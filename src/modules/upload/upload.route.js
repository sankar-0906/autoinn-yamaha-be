import { Router } from 'express';
import { UploadController } from './upload.controller.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
// Setup multer storage
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, `${randomName}${extension}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype || extname) {
            return cb(null, true);
        }
        cb(new Error('File type not allowed'));
    }
});
const router = Router();
router.post('/image', upload.single('file'), UploadController.uploadImage);
export default router;
//# sourceMappingURL=upload.route.js.map