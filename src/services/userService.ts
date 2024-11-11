import { User, CreateUserDto, UpdateUserDto, UserResponse } from '../types/user.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { AuthService } from './authService.js';
import crypto from 'crypto';

const users = new Map<string, User>();

export class UserService {
  constructor(private authService: AuthService) {}

  private toResponse(user: User): UserResponse {
    const { password, ...response } = user;
    return response;
  }

  async findByEmail(email: string): Promise<User | null> {
    return Array.from(users.values()).find((user) => user.email === email) || null;
  }

  async create(dto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const id = crypto.randomUUID();
    const now = new Date();
    const hashedPassword = await this.authService.hashPassword(dto.password);
    
    const user: User = {
      id,
      ...dto,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    users.set(id, user);
    logger.info('User created', { userId: id });
    return this.toResponse(user);
  }

  async findAll(): Promise<UserResponse[]> {
    return Array.from(users.values()).map(this.toResponse);
  }

  async findById(id: string): Promise<UserResponse> {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return this.toResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.findByEmail(dto.email);
      if (emailExists) {
        throw new ValidationError('Email already exists');
      }
    }

    const updatedUser: User = {
      ...user,
      ...dto,
      password: dto.password 
        ? await this.authService.hashPassword(dto.password)
        : user.password,
      updatedAt: new Date(),
    };

    users.set(id, updatedUser);
    logger.info('User updated', { userId: id });
    return this.toResponse(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const exists = users.has(id);
    if (!exists) {
      throw new NotFoundError('User not found');
    }

    users.delete(id);
    logger.info('User deleted', { userId: id });
  }
}