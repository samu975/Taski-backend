import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
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
      introspection: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_TEST_HOST
          : process.env.DB_HOST,
      port:
        process.env.NODE_ENV === 'test'
          ? +process.env.DB_TEST_PORT
          : +process.env.DB_PORT,
      username:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_TEST_USER
          : process.env.DB_USER,
      password:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_TEST_PASSWORD
          : process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_TEST_NAME
          : process.env.DB_NAME,
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
