import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.js';
import { loginSchema } from './auth.validation.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.get('/loginCredentials', authenticate, AuthController.getCredentials);

export default router;
