import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../schemas/authSchema.js';

const authController = new AuthController();
export const authRouter = Router();

authRouter.post('/register', validateRequest(registerSchema), authController.register);
authRouter.post('/login', validateRequest(loginSchema), authController.login);