import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  const port = parseInt(process.env.PORT, 10) || 3001;

  try {
    await app.listen(port);
    console.log(`🚀 Labbini API is running on: http://localhost:${port}/api`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use.`);
      console.error(`   Fix: Kill the process using port ${port} or set a different PORT:`);
      console.error(`   Windows: netstat -ano | findstr :${port}`);
      console.error(`   Linux/Mac: lsof -i :${port}`);
      console.error(`   Or run with: PORT=3002 pnpm dev:backend`);
      process.exit(1);
    }
    throw error;
  }
}
bootstrap();
