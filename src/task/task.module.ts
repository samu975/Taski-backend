import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { UsersService } from 'src/users/users.service';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { Task } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [TaskResolver, TaskService, UsersService, CategoryService],
  imports: [
    TypeOrmModule.forFeature([Task, Category, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => CategoryModule),
  ],
})
export class TaskModule {}
