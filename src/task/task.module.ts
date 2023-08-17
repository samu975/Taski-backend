import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { UsersService } from '../users/users.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [TaskResolver, TaskService, UsersService, CategoryService],
  imports: [
    TypeOrmModule.forFeature([Task, Category, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => CategoryModule),
  ],
})
export class TaskModule {}
