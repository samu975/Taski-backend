import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  const corsOption = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001}',
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOption));
  await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();
