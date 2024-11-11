import { z } from 'zod';

const websiteSchema = z.string().url().optional();
const bioSchema = z.string().max(500).optional();
const locationSchema = z.string().max(100).optional();
const avatarSchema = z.string().url().optional();

export const createProfileSchema = z.object({
  body: z.object({
    website: websiteSchema,
    bio: bioSchema,
    location: locationSchema,
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    website: websiteSchema,
    bio: bioSchema,
    location: locationSchema,
    avatar: avatarSchema,
  }),
});