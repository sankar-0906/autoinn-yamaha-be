import { Router } from 'express';
import { BranchController } from './branch.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { createBranchSchema, updateBranchSchema } from './branch.validation.js';
const router = Router();
// Unprotected — used during initial onboarding setup (retaining current project style)
router.post('/', validate(createBranchSchema), BranchController.createBranch);
router.use(authenticate);
router.get('/', BranchController.getAllBranches);
// Mirroring autoinn's pattern for paginated fetches
router.post('/get', BranchController.getAllBranches);
router.get('/:id', BranchController.getBranchById);
router.put('/:id', validate(updateBranchSchema), BranchController.updateBranch);
router.delete('/:id', BranchController.deleteBranch);
export default router;
//# sourceMappingURL=branch.route.js.map