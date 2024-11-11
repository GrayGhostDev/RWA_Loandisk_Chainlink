import { AuthService } from '../../services/authService.js';
import { UserService } from '../../services/userService.js';
import type { User } from '../../types/user.js';

let authService: AuthService;
let userService: UserService;

export const setupTestServices = () => {
  authService = new AuthService();
  userService = new UserService(authService);
  authService['userService'] = userService;
};

export const createTestUser = async (): Promise<User> => {
  if (!userService) setupTestServices();

  const user = await userService.create({
    email: `test${Date.now()}@example.com`,
    name: 'Test User',
    password: 'Test123!@#'
  });

  return user as User;
};

export const getTestUserToken = async (user: User): Promise<string> => {
  if (!authService) setupTestServices();

  const { token } = await authService.login({
    email: user.email,
    password: 'Test123!@#'
  });

  return token;
};