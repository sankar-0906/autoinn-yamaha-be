import { Router } from 'express';
import { GstVerifyController } from './gstVerify.controller.js';
import { authenticate } from '../../middlewares/auth.js';
const router = Router();
router.use(authenticate);
router.post('/', GstVerifyController.verifyGST);
export default router;
