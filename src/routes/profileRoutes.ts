import { Router } from 'express';
import { ProfileController } from '../controllers/profileController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createProfileSchema, updateProfileSchema } from '../schemas/profileSchema.js';
import { auth } from '../middleware/auth.js';

const profileController = new ProfileController();
export const profileRouter = Router();

// All profile routes require authentication
profileRouter.use(auth);

profileRouter.post('/', validateRequest(createProfileSchema), profileController.create);
profileRouter.get('/:userId', profileController.findByUserId);
profileRouter.patch('/', validateRequest(updateProfileSchema), profileController.update);
profileRouter.delete('/', profileController.delete);