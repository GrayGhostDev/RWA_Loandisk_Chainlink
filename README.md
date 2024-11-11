# Node.js Express TypeScript Starter

A modern, production-ready Node.js application starter with Express, TypeScript, and React integration.

## Features

- 🚀 Express.js with TypeScript
- 🔒 JWT Authentication
- 🛡️ Security middleware (helmet, cors, rate limiting)
- 📝 Request validation with Zod
- 🌐 React frontend with Tailwind CSS
- 💼 Web3 integration
- ✨ Clean architecture and best practices

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure environment variables
4. Start development server: `npm run dev`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Project Structure

```
src/
├── components/     # React components
├── controllers/    # Express route controllers
├── middleware/     # Express middleware
├── routes/         # Express routes
├── services/       # Business logic
├── types/         # TypeScript types
├── utils/         # Utility functions
└── config/        # Configuration
```

## API Documentation

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PATCH `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Profiles

- POST `/api/profiles` - Create profile
- GET `/api/profiles/:userId` - Get profile
- PATCH `/api/profiles` - Update profile
- DELETE `/api/profiles` - Delete profile

## License

MIT