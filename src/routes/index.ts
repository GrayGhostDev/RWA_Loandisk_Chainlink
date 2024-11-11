import { Router } from 'express';
import { userRouter } from './userRoutes.js';
import { authRouter } from './authRoutes.js';
import { profileRouter } from './profileRoutes.js';
import { healthRouter } from './healthRoutes.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/profiles', profileRouter);