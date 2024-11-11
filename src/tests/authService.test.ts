import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';
import { UnauthorizedError } from '../utils/errors.js';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(() => {
    authService = new AuthService();
    userService = new UserService(authService);
    authService['userService'] = userService;
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      };

      const result = await authService.register(dto);

      expect(result.token).toBeDefined();
      expect(result.user).toMatchObject({
        email: dto.email,
        name: dto.name,
      });
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      };

      await authService.register(dto);

      const result = await authService.login({
        email: dto.email,
        password: dto.password,
      });

      expect(result.token).toBeDefined();
      expect(result.user).toMatchObject({
        email: dto.email,
        name: dto.name,
      });
    });

    it('should throw UnauthorizedError with incorrect password', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      };

      await authService.register(dto);

      await expect(
        authService.login({
          email: dto.email,
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});