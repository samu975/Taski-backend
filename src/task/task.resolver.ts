import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/currentUser.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @CurrentUser() user: User,
  ) {
    return this.taskService.create(createTaskInput, user);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(@CurrentUser() user: User) {
    return this.taskService.findAll(user);
  }

  @Query(() => Task, { name: 'task' })
  findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.findOne(id, user);
  }

  @Mutation(() => Task)
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @CurrentUser() user: User,
  ) {
    return this.taskService.update(updateTaskInput.id, updateTaskInput, user);
  }

  @Mutation(() => Task)
  removeTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.remove(id, user);
  }
}
