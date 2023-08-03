import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createTaskInput: CreateTaskInput, user: User) {
    const { categories } = user;

    let category;

    if (createTaskInput.categoryID) {
      category = categories.find(
        (category) => category.id === createTaskInput.categoryID,
      );
    } else {
      const uncategorizedCategory = categories.find(
        (category) => category.name === 'Uncategorized',
      );

      if (uncategorizedCategory) {
        category = uncategorizedCategory;
      } else {
        const newCategory = await this.categoryService.create(
          { name: 'Uncategorized', color: 'white' },
          user,
        );
        category = newCategory;
      }
    }

    const newTask = this.taskRepository.create({
      ...createTaskInput,
      user,
      category,
    });

    newTask.user = user;
    return this.taskRepository.save(newTask);
  }
  addTaskToCategory() {}

  async findAll(user: User) {
    const task = await this.taskRepository.find({
      where: { user },
      relations: ['category'],
    });
    task.forEach((task) => {
      task.user = user;
      task.category = user.categories.find(
        (category) => category.id === task.category.id,
      );
    });
    return task;
  }

  async findOne(id: string, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['category'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    task.user = user;
    return task;
  }

  async update(
    id: string,
    updateTaskInput: UpdateTaskInput,
    currentUser: User,
  ) {
    const taskUpdated = await this.taskRepository.preload({
      ...updateTaskInput,
      id,
      category: { id: updateTaskInput.categoryID },
    });

    taskUpdated.user = currentUser;
    return this.taskRepository.save(taskUpdated);
  }

  async remove(id: string, user: User) {
    const task = await this.findOne(id, user);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.taskRepository.remove(task);
  }
}
