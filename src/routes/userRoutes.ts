import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';

const userController = new UserController();
export const userRouter = Router();

userRouter.post('/', validateRequest(createUserSchema), userController.create);
userRouter.get('/', userController.findAll);
userRouter.get('/:id', userController.findById);
userRouter.patch('/:id', validateRequest(updateUserSchema), userController.update);
userRouter.delete('/:id', userController.delete);