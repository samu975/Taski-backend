import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { User } from '../users/entities/user.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TaskResolver', () => {
  let taskResolver: TaskResolver;
  let taskService: TaskService;

  const user: User = new User();
  user.id = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    taskResolver = module.get<TaskResolver>(TaskResolver);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskResolver).toBeDefined();
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

    const result = await taskResolver.createTask(createTaskInput, user);
    expect(result).toEqual(createdTask);
  });

  it('should find all tasks', async () => {
    const tasks = [new Task(), new Task()];

    jest.spyOn(taskService, 'findAll').mockResolvedValue(tasks);

    const result = await taskResolver.findAll(user);
    expect(result).toEqual(tasks);
  });

  it('should find a task by ID', async () => {
    const taskId = '1';
    const foundTask = new Task();

    jest.spyOn(taskService, 'findOne').mockResolvedValue(foundTask);

    const result = await taskResolver.findOne(taskId, user);
    expect(result).toEqual(foundTask);
  });

  it('should throw NotFoundException when finding non-existing task', async () => {
    const taskId = '999';

    jest
      .spyOn(taskService, 'findOne')
      .mockRejectedValue(new NotFoundException());

    await expect(taskResolver.findOne(taskId, user)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should remove a task by ID', async () => {
    const taskId = '1';
    const removedTask = new Task();

    jest.spyOn(taskService, 'remove').mockResolvedValue(removedTask);

    const result = await taskResolver.removeTask(taskId, user);
    expect(result).toEqual(removedTask);
  });

  it('should throw NotFoundException when removing non-existing task', async () => {
    const taskId = '999';

    jest
      .spyOn(taskService, 'remove')
      .mockRejectedValue(new NotFoundException());

    await expect(taskResolver.removeTask(taskId, user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
