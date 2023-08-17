import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
};

const mockCategoryService = {
  create: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserInput: CreateUserInput = {
        name: 'New User',
        email: 'user@example.com',
        password: 'password123',
        lastname: 'test',
      };
      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      const newUser = { ...createUserInput, password: hashedPassword };
      const createdUser = { ...newUser, id: '1' };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(createdUser);
      mockCategoryService.create.mockResolvedValue({
        id: '1',
        name: 'Uncategorized',
        color: 'white',
      });

      const result = await service.create(createUserInput);

      expect(result).toEqual(createdUser);
      expect(result.password).not.toBe(createUserInput.password);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
      expect(mockCategoryService.create).toHaveBeenCalledWith(
        { name: 'Uncategorized', color: 'white' },
        newUser,
      );
    });

    it('should throw an error if creation fails', async () => {
      const createUserInput: CreateUserInput = {
        name: 'New User',
        email: 'user@example.com',
        password: 'password123',
        lastname: 'test',
      };

      mockUserRepository.create.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.create(createUserInput)).rejects.toThrowError(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'User 1',
          email: 'test@testing.com',
          password: 'password123',
          isActive: true,
          lastname: 'test',
        },
        {
          id: '2',
          name: 'User 2',
          email: 'test@testing.com',
          password: 'password123',
          isActive: true,
          lastname: 'test',
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser: User = {
        id: '1',
        name: 'User 1',
        email: 'test@testing.com',
        password: 'password123',
        isActive: true,
        lastname: 'test',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        relations: ['categories', 'tasks'],
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserInput: UpdateUserInput = {
        id: '1',
        name: 'Updated User',
      };
      const updatedUser: User = {
        id: '1',
        name: 'Updated User',
        email: 'test@testing.com',
        password: 'password123',
        isActive: true,
        lastname: 'test',
      };

      mockUserRepository.preload.mockResolvedValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserInput);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.preload).toHaveBeenCalledWith({
        ...updateUserInput,
        id: '1',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw an error if update fails', async () => {
      const updateUserInput: UpdateUserInput = {
        id: '1',
        name: 'Updated User',
      };

      mockUserRepository.preload.mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(service.update('1', updateUserInput)).rejects.toThrowError(
        'Database error',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user by ID', async () => {
      const id = '1';

      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(id);

      expect(result).toEqual(`The user with id: ${id} has been deleted`);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
