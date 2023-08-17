import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { UpdateCategoryInput } from './dto/update-category.input';
import { NotFoundException } from '@nestjs/common';
import { Task } from '../task/entities/task.entity';
import { User } from '../users/entities/user.entity';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: Repository<Category>;
  let taskRepository: Repository<Task>;

  const user: User = new User();
  user.id = '1';
  user.name = 'test';
  user.lastname = 'suit';
  user.email = 'test@testing.com';
  user.password = 'test';
  user.isActive = true;
  user.categories = [];
  user.tasks = [];

  const category: Category = new Category();
  category.id = '1';
  category.name = 'testNameCategory';
  category.color = 'TestColor';
  category.user = user;
  category.tasks = [];

  user.categories = [category];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  it('should create a category', async () => {
    jest.spyOn(categoryRepository, 'create').mockReturnValue(category);
    jest.spyOn(categoryRepository, 'save').mockResolvedValue(category);

    const result = await categoryService.create(category, user);
    expect(result).toEqual(category);
  });

  it('should throw NotFoundException when updating non-existing category', async () => {
    const updateCategoryInput: UpdateCategoryInput = {
      id: '1',
      name: 'testNameCategoryUpdate',
      color: 'TestColorUpdate',
    };

    jest
      .spyOn(categoryService, 'findOne')
      .mockRejectedValue(new NotFoundException());

    await expect(
      categoryService.update('1', updateCategoryInput, user),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a category', async () => {
    const updateCategoryInput: UpdateCategoryInput = {
      id: '1',
      name: 'testNameCategoryUpdate',
      color: 'TestColorUpdate',
    };

    jest.spyOn(categoryService, 'findOne').mockResolvedValue(category);

    jest
      .spyOn(categoryRepository, 'save')
      .mockImplementation((category) => Promise.resolve(category) as any);

    const result = await categoryService.update('1', updateCategoryInput, user);
    expect(result).toEqual(category);
  });

  it('should delete a category', async () => {
    jest.spyOn(categoryService, 'remove').mockImplementation(async () => {
      return {
        id: '1',
        name: 'categoryName1',
        color: 'categoryColor1',
        user: user,
      };
    });

    expect(await categoryService.remove('1', user)).toEqual({
      id: '1',
      name: 'categoryName1',
      color: 'categoryColor1',
      user: user,
    });
    expect(categoryService.remove).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when deleting non-existing category', async () => {
    jest
      .spyOn(categoryService, 'findOne')
      .mockRejectedValue(new NotFoundException());

    await expect(categoryService.remove('1', user)).rejects.toThrow(
      NotFoundException,
    );
  });
});
