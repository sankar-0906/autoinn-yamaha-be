import { Router } from 'express';
import { RoleAccessController } from './roleAccess.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createRoleAccessSchema } from './roleAccess.validation.js';
const router = Router();
// Unprotected — used during initial onboarding setup
router.post('/', validate(createRoleAccessSchema), RoleAccessController.create);
router.use(authenticate);
router.get('/', RoleAccessController.getAll);
router.get('/:id', RoleAccessController.getById);
router.delete('/:id', RoleAccessController.delete);
export default router;
