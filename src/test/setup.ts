import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/users.service';
import { testUser } from 'src/stubs/user.stub';
import { getConnection } from 'typeorm';

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, TypeOrmModule.forRoot()],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const usersService = moduleRef.get<UsersService>('UsersService');
  await usersService.create(testUser);

  const connection = getConnection();
  await connection.dropDatabase();
};
