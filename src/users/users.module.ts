import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';
import { TaskService } from 'src/task/task.service';

@Module({
  providers: [UsersResolver, UsersService, CategoryService, TaskService],
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    forwardRef(() => CategoryModule),
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
