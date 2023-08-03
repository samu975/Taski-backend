import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  const corsOption = {
    origin: 'http://localhost:3001',
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOption));
  await app.listen(3000);
}
bootstrap();
