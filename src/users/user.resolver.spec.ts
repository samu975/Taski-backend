import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CategoryService } from '../category/category.service';
import { TaskService } from '../task/task.service';
import { NotFoundException } from '@nestjs/common';

const mockUsersService = {
  create: jest.fn((createUserInput: CreateUserInput) => ({
    id: '1',
    ...createUserInput,
  })),
  findAll: jest.fn(() => [
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
  ]),
  findOne: jest.fn((id: string) => {
    if (id === '1') {
      return Promise.resolve({ id: '1', name: 'User 1' });
    }
    return Promise.resolve(null);
  }),
  update: jest.fn((id: string, updateUserInput: UpdateUserInput) => {
    if (id === '1') {
      return Promise.resolve({ id, ...updateUserInput });
    }
    return Promise.resolve(null);
  }),
  remove: jest.fn((id: string) => {
    if (id === '1') {
      return Promise.resolve({ id });
    }
    return Promise.resolve(null);
  }),
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CategoryService,
          useValue: {},
        },
        {
          provide: TaskService,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const input: CreateUserInput = {
        name: 'test',
        lastname: 'test',
        email: 'testing@test.com',
        password: 'test',
      };
      const user = await resolver.createUser(input);
      expect(user).toEqual(expect.objectContaining(input));
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await resolver.findAll();
      expect(users).toHaveLength(2);
      expect(users[0]).toEqual({ id: '1', name: 'User 1' });
      expect(users[1]).toEqual({ id: '2', name: 'User 2' });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = await resolver.findOne('1');
      expect(user).toEqual({ id: '1', name: 'User 1' });
    });

    it('should return null if user is not found', async () => {
      const user = await resolver.findOne('999');
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const input: UpdateUserInput = { id: '1', name: 'Updated User' };
      const user = await resolver.updateUser(input);
      expect(user).toEqual(input);
    });

    it('should return null if user is not found', async () => {
      const input: UpdateUserInput = { id: '999', name: 'Updated User' };
      const user = await resolver.updateUser(input);
      expect(user).toBeNull();
    });
  });

  describe('removeUser', () => {
    it('should remove a user by ID', async () => {
      const result = await resolver.removeUser('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should return null if user is not found', async () => {
      const result = await resolver.removeUser('999');
      expect(result).toBeNull();
    });
  });
});
