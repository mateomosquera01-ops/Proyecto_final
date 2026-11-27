import app from './app';
import { prisma } from './config/database';
import { env } from './config/environment';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('[Textech] Conexión a base de datos establecida.');

    const server = app.listen(env.port, () => {
      console.log(`[Textech] Servidor API escuchando en http://localhost:${env.port}/api/v1`);
    });

    const shutdown = async () => {
      console.log('[Textech] Cerrando servidor...');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Textech] Error crítico al iniciar el servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
