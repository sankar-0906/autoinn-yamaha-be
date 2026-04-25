import { Router } from 'express';
import { DepartmentController } from './department.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createDepartmentSchema, updateDepartmentSchema } from './department.validation.js';
import { authenticate } from '../../middlewares/auth.js';
const router = Router();
// Unprotected — used during initial onboarding setup
router.post('/', validate(createDepartmentSchema), DepartmentController.create);
router.use(authenticate);
router.get('/', DepartmentController.getAll);
router.get('/:id', DepartmentController.getById);
router.put('/:id', validate(updateDepartmentSchema), DepartmentController.update);
router.delete('/:id', DepartmentController.delete);
export default router;
