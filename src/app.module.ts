import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { TaskModule } from './task/task.module';
// import { CategoryModule } from './category/category.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppResolver } from './app.resolver';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'safero99',
      password: 'safero99',
      database: 'taskiDB',
      synchronize: true,
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    AuthModule,
    CategoryModule,
    TaskModule,
  ],

  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}