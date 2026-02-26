import { Router } from 'express';
import { CompanyController } from './company.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createCompanySchema, updateCompanySchema } from './company.validation.js';
import { authenticate } from '../../middlewares/auth.js';
const router = Router();
router.post('/', validate(createCompanySchema), CompanyController.create);
router.use(authenticate);
router.get('/', CompanyController.getAll);
router.get('/:id', CompanyController.getById);
router.put('/:id', validate(updateCompanySchema), CompanyController.update);
router.delete('/:id', CompanyController.delete);
export default router;
//# sourceMappingURL=company.route.js.map