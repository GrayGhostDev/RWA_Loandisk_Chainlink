export interface Profile {
  userId: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileDto {
  bio?: string;
  location?: string;
  website?: string;
}

export interface UpdateProfileDto {
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

export interface ProfileResponse extends Profile {
  user: {
    name: string;
    email: string;
  };
}