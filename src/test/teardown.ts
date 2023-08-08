import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, TypeOrmModule.forRoot()],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const connection = getConnection();
  await connection.dropDatabase();

  await app.close();
};
