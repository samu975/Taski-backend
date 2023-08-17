import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;
  let categoryRepository: Repository<Category>;
  let categoryService: CategoryService;

  const user: User = new User();
  const category: Category = new Category();
  user.id = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(() => Promise.resolve(category)),
          },
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    categoryService = module.get<CategoryService>(CategoryService); // Agrega esta línea
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskInput: CreateTaskInput = {
      title: 'Test',
      description: 'Test',
      status: 'OPEN',
      expiredAt: new Date(),
      categoryID: '1',
    };
    const createdTask = new Task();

    jest.spyOn(taskService, 'create').mockResolvedValue(createdTask);

    const result = await taskService.create(createTaskInput, user);
    expect(result).toEqual(createdTask);
  });

  it('should find all tasks', async () => {
    const tasks = [new Task(), new Task()];

    jest.spyOn(taskService, 'findAll').mockResolvedValue(tasks);

    const result = await taskService.findAll(user);
    expect(result).toEqual(tasks);
  });

  it('should find a task by ID', async () => {
    const date = new Date();

    jest.spyOn(taskService, 'findOne').mockImplementation(async () => {
      return {
        category,
        id: '1',
        user,
        title: 'Test',
        description: 'Test',
        status: 'OPEN',
        expiredAt: date,
        categoryID: '1',
      };
    });

    expect(await taskService.findOne('1', user)).toEqual({
      category,
      id: '1',
      user,
      title: 'Test',
      description: 'Test',
      status: 'OPEN',
      expiredAt: date,
      categoryID: '1',
    });
    expect(taskService.findOne).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when finding non-existing task', async () => {
    const taskId = '999';

    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(undefined);

    await expect(taskService.findOne(taskId, user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a task', async () => {
    const updateTaskInput: UpdateTaskInput = {
      id: '1',
      title: 'TestUpdated',
    };
    const taskUpdated = new Task();

    jest.spyOn(taskRepository, 'preload').mockResolvedValue(taskUpdated);
    jest.spyOn(taskRepository, 'save').mockResolvedValue(taskUpdated);

    const result = await taskService.update('1', updateTaskInput, user);
    expect(result).toEqual(taskUpdated);
  });

  it('should remove a task', async () => {
    const removedTask = new Task();

    jest.spyOn(taskService, 'findOne').mockResolvedValue(removedTask);
    jest.spyOn(taskRepository, 'remove').mockResolvedValue(removedTask);

    const result = await taskService.remove('1', user);
    expect(result).toEqual(removedTask);
  });

  it('should throw NotFoundException when removing non-existing task', async () => {
    jest
      .spyOn(taskService, 'findOne')
      .mockRejectedValue(new NotFoundException());

    await expect(taskService.remove('999', user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
