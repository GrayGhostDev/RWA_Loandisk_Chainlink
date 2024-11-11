import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { limiter } from './middleware/rateLimit.js';
import { router } from './routes/index.js';

const app = express();

// Security middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);
app.use(express.json());

// Routes
app.use('/api', router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});