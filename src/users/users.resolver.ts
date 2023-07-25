import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Category } from 'src/category/entities/category.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { CategoryService } from 'src/category/category.service';
import { TaskService } from 'src/task/task.service';
import { Task } from 'src/task/entities/task.entity';
import { ParseUUIDPipe } from '@nestjs/common';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoryService: CategoryService,
    private readonly taskService: TaskService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @ResolveField(() => [Category], { name: 'category' })
  async getListsByUser(
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<Category[]> {
    const categories = await this.categoryService.findAll(user, paginationArgs);
    console.log(categories);
    return categories;
  }

  // @ResolveField(() => [Task], { name: 'tasks' })
  // async getTaskByUser(
  //   @Parent() user: User,
  //   @Args() paginationArgs: PaginationArgs,
  // ): promise<Task[]> {
  //   return this.taskService.findAll(user.id, paginationArgs);
  // }
}
