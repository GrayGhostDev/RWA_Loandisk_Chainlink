import { Profile, CreateProfileDto, UpdateProfileDto, ProfileResponse } from '../types/profile.js';
import { NotFoundError } from '../utils/errors.js';
import { UserService } from './userService.js';
import { logger } from '../utils/logger.js';

const profiles = new Map<string, Profile>();

export class ProfileService {
  constructor(private userService: UserService) {}

  private async toResponse(profile: Profile): Promise<ProfileResponse> {
    const user = await this.userService.findById(profile.userId);
    return {
      ...profile,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async create(userId: string, dto: CreateProfileDto): Promise<ProfileResponse> {
    // Verify user exists
    await this.userService.findById(userId);

    if (profiles.has(userId)) {
      throw new Error('Profile already exists');
    }

    const now = new Date();
    const profile: Profile = {
      userId,
      ...dto,
      createdAt: now,
      updatedAt: now,
    };

    profiles.set(userId, profile);
    logger.info('Profile created', { userId });
    
    return this.toResponse(profile);
  }

  async findByUserId(userId: string): Promise<ProfileResponse> {
    const profile = profiles.get(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    return this.toResponse(profile);
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<ProfileResponse> {
    const profile = profiles.get(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const updatedProfile: Profile = {
      ...profile,
      ...dto,
      updatedAt: new Date(),
    };

    profiles.set(userId, updatedProfile);
    logger.info('Profile updated', { userId });
    
    return this.toResponse(updatedProfile);
  }

  async delete(userId: string): Promise<void> {
    const exists = profiles.has(userId);
    if (!exists) {
      throw new NotFoundError('Profile not found');
    }

    profiles.delete(userId);
    logger.info('Profile deleted', { userId });
  }
}