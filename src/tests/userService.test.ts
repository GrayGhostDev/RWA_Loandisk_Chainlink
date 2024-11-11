import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../services/userService.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };
      const user = await userService.create(dto);

      expect(user).toMatchObject(dto);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw ValidationError if email already exists', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };
      await userService.create(dto);

      await expect(userService.create(dto)).rejects.toThrow(ValidationError);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };
      const created = await userService.create(dto);
      const found = await userService.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      await expect(userService.findById('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };
      const created = await userService.create(dto);
      const updated = await userService.update(created.id, { name: 'Updated Name' });

      expect(updated.name).toBe('Updated Name');
      expect(updated.updatedAt).not.toEqual(created.updatedAt);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      await expect(
        userService.update('non-existent', { name: 'Test' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const dto = { email: 'test@example.com', name: 'Test User' };
      const created = await userService.create(dto);
      
      await expect(userService.delete(created.id)).resolves.not.toThrow();
      await expect(userService.findById(created.id)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      await expect(userService.delete('non-existent')).rejects.toThrow(NotFoundError);
    });
  });
});