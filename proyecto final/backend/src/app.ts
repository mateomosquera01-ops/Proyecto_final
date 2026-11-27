import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { errorMiddleware } from './middlewares/error.middleware';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';
import { sanitizeBodyMiddleware } from './middlewares/validation.middleware';
import apiV1Routes from './routes';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(apiRateLimiter);
app.use(sanitizeBodyMiddleware);

app.use('/api/v1', apiV1Routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada en la API de Textech',
  });
});

app.use(errorMiddleware);

export default app;
