import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';
import { CreateUserDto, UpdateUserDto } from '../types/user.js';
import { logger } from '../utils/logger.js';

const userService = new UserService();

export class UserController {
  async create(req: Request<{}, {}, CreateUserDto>, res: Response) {
    logger.debug('Creating user', { body: req.body });
    const user = await userService.create(req.body);
    res.status(201).json(user);
  }

  async findAll(req: Request, res: Response) {
    logger.debug('Fetching all users');
    const users = await userService.findAll();
    res.json(users);
  }

  async findById(req: Request<{ id: string }>, res: Response) {
    logger.debug('Fetching user by id', { userId: req.params.id });
    const user = await userService.findById(req.params.id);
    res.json(user);
  }

  async update(req: Request<{ id: string }, {}, UpdateUserDto>, res: Response) {
    logger.debug('Updating user', { userId: req.params.id, body: req.body });
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    logger.debug('Deleting user', { userId: req.params.id });
    await userService.delete(req.params.id);
    res.status(204).send();
  }
}