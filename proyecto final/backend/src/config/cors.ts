import { CorsOptions } from 'cors';
import { env } from './environment';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.corsOrigin.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origen no permitido por la política CORS de Textech'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
