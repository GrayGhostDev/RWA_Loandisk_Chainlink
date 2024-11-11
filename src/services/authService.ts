import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { UserService } from './userService.js';
import { UnauthorizedError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import type { LoginDto } from '../types/auth.js';
import type { CreateUserDto, UserResponse } from '../types/user.js';

export class AuthService {
  constructor(private userService?: UserService) {}

  async register(dto: CreateUserDto): Promise<{ token: string; user: UserResponse }> {
    if (!this.userService) {
      throw new Error('UserService not initialized');
    }

    const user = await this.userService.create(dto);
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    logger.info('User registered', { userId: user.id });

    return { token, user };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: UserResponse }> {
    if (!this.userService) {
      throw new Error('UserService not initialized');
    }

    const user = await this.userService.findByEmail(dto.email);
    
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    logger.info('User logged in', { userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}