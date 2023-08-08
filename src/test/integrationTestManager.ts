import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

export class IntegrationTestManager {
  public httpServer: any;

  private app: INestApplication;

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot()],
    }).compile();

    this.app = moduleRef.createNestApplication();
    await this.app.init();
    this.httpServer = this.app.getHttpServer();
    const authService = this.app.get<AuthService>('AuthService');
  }
}
