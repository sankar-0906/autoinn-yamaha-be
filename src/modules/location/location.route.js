import { Router } from 'express';
import { LocationController } from './location.controller.js';
const router = Router();
router.get('/countries', LocationController.getCountries);
router.get('/states/:countryId', LocationController.getStates);
router.get('/cities/:stateId', LocationController.getCities);
export default router;
//# sourceMappingURL=location.route.js.map