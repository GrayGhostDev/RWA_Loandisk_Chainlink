import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { logger } from '../utils/logger.js';
import type { LoginDto } from '../types/auth.js';
import type { CreateUserDto } from '../types/user.js';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService(this.authService);
    this.authService['userService'] = this.userService;
  }

  register = async (req: Request<{}, {}, CreateUserDto>, res: Response) => {
    logger.debug('Registration attempt', { email: req.body.email });
    const result = await this.authService.register(req.body);
    res.status(201).json(result);
  };

  login = async (req: Request<{}, {}, LoginDto>, res: Response) => {
    logger.debug('Login attempt', { email: req.body.email });
    const result = await this.authService.login(req.body);
    res.json(result);
  };
}