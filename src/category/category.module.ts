import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from './entities/category.entity';
import { TaskModule } from 'src/task/task.module';
import { UsersModule } from 'src/users/users.module';
import { Task } from 'src/task/entities/task.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [CategoryResolver, CategoryService, UsersService],
  imports: [
    TypeOrmModule.forFeature([Category, Task, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => TaskModule),
  ],
  exports: [TypeOrmModule, CategoryService],
})
export class CategoryModule {}
