import { Request, Response } from 'express';
import { ProfileService } from '../services/profileService.js';
import { UserService } from '../services/userService.js';
import { AuthService } from '../services/authService.js';
import { CreateProfileDto, UpdateProfileDto } from '../types/profile.js';
import { logger } from '../utils/logger.js';

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    const authService = new AuthService();
    const userService = new UserService(authService);
    this.profileService = new ProfileService(userService);
  }

  create = async (req: Request<{}, {}, CreateProfileDto>, res: Response) => {
    if (!req.userId) throw new Error('User ID required');
    
    logger.debug('Creating profile', { userId: req.userId });
    const profile = await this.profileService.create(req.userId, req.body);
    res.status(201).json(profile);
  };

  findByUserId = async (req: Request<{ userId: string }>, res: Response) => {
    logger.debug('Fetching profile', { userId: req.params.userId });
    const profile = await this.profileService.findByUserId(req.params.userId);
    res.json(profile);
  };

  update = async (req: Request<{}, {}, UpdateProfileDto>, res: Response) => {
    if (!req.userId) throw new Error('User ID required');
    
    logger.debug('Updating profile', { userId: req.userId });
    const profile = await this.profileService.update(req.userId, req.body);
    res.json(profile);
  };

  delete = async (req: Request, res: Response) => {
    if (!req.userId) throw new Error('User ID required');
    
    logger.debug('Deleting profile', { userId: req.userId });
    await this.profileService.delete(req.userId);
    res.status(204).send();
  };
}