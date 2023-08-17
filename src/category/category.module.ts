import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';
import { TaskModule } from '../task/task.module';
import { UsersModule } from '../users/users.module';
import { Task } from '../task/entities/task.entity';
import { UsersService } from '../users/users.service';

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
