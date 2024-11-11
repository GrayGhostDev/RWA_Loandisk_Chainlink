import { describe, it, expect, beforeEach } from 'vitest';
import { ProfileService } from '../services/profileService.js';
import { UserService } from '../services/userService.js';
import { AuthService } from '../services/authService.js';
import { NotFoundError } from '../utils/errors.js';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let userService: UserService;
  let userId: string;

  beforeEach(async () => {
    const authService = new AuthService();
    userService = new UserService(authService);
    profileService = new ProfileService(userService);

    // Create a test user
    const user = await userService.create({
      email: 'test@example.com',
      name: 'Test User',
      password: 'Test123!@#',
    });
    userId = user.id;
  });

  describe('create', () => {
    it('should create a profile successfully', async () => {
      const dto = {
        bio: 'Test bio',
        location: 'Test location',
        website: 'https://example.com',
      };

      const profile = await profileService.create(userId, dto);

      expect(profile).toMatchObject({
        userId,
        ...dto,
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    });

    it('should throw error if profile already exists', async () => {
      await profileService.create(userId, { bio: 'Test' });
      await expect(profileService.create(userId, { bio: 'Test' }))
        .rejects.toThrow('Profile already exists');
    });
  });

  describe('update', () => {
    it('should update profile successfully', async () => {
      await profileService.create(userId, { bio: 'Original bio' });
      
      const dto = {
        bio: 'Updated bio',
        location: 'New location',
      };

      const updated = await profileService.update(userId, dto);

      expect(updated).toMatchObject({
        userId,
        ...dto,
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    });

    it('should throw NotFoundError if profile does not exist', async () => {
      await expect(profileService.update(userId, { bio: 'Test' }))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete profile successfully', async () => {
      await profileService.create(userId, { bio: 'Test bio' });
      await expect(profileService.delete(userId)).resolves.not.toThrow();
      await expect(profileService.findByUserId(userId)).rejects.toThrow(NotFoundError);
    });
  });
});