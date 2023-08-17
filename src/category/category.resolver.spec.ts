import { Test, TestingModule } from '@nestjs/testing';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

import { Task } from '../task/entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoryResolver', () => {
  let categoryResolver: CategoryResolver;
  let categoryService: CategoryService;

  let categoryRepository: Repository<Category>;
  let taskRespository: Repository<Task>;

  //new user
  const user = new User();
  (user.id = '1'),
    (user.name = 'testUserName'),
    (user.lastname = 'testUserLastName'),
    (user.email = 'test@testing.com'),
    (user.password = '123456'),
    (user.tasks = []),
    (user.categories = []);

  // Tests
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryResolver,
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

    categoryService = new CategoryService(categoryRepository, taskRespository);
    categoryResolver = new CategoryResolver(categoryService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    taskRespository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });
  it('should return a list of categories', async () => {
    jest.spyOn(categoryService, 'findAll').mockImplementation(async () => [
      { id: '1', name: 'categoryName1', color: 'categoryColor1', user: user },
      { id: '2', name: 'categoryName2', color: 'categoryColor2', user: user },
      { id: '3', name: 'categoryName3', color: 'categoryColor3', user: user },
      { id: '4', name: 'categoryName4', color: 'categoryColor4', user: user },
    ]);

    expect(await categoryResolver.findAll(user)).toEqual([
      { id: '1', name: 'categoryName1', color: 'categoryColor1', user: user },
      { id: '2', name: 'categoryName2', color: 'categoryColor2', user: user },
      { id: '3', name: 'categoryName3', color: 'categoryColor3', user: user },
      { id: '4', name: 'categoryName4', color: 'categoryColor4', user: user },
    ]);
    expect(categoryService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a category', async () => {
    jest.spyOn(categoryService, 'findOne').mockImplementation(async () => {
      return {
        id: '1',
        name: 'categoryName1',
        color: 'categoryColor1',
        user: user,
      };
    });

    expect(await categoryResolver.findOne('1', user)).toEqual({
      id: '1',
      name: 'categoryName1',
      color: 'categoryColor1',
      user: user,
    });
    expect(categoryService.findOne).toHaveBeenCalledTimes(1);
  });

  it('should create a category', async () => {
    jest.spyOn(categoryService, 'create').mockImplementation(async () => {
      return {
        id: '1',
        name: 'categoryName1',
        color: 'categoryColor1',
        user: user,
      };
    });

    expect(
      await categoryResolver.createCategory(
        { name: 'categoryName1', color: 'categoryColor1' },
        user,
      ),
    ).toEqual({
      id: '1',
      name: 'categoryName1',
      color: 'categoryColor1',
      user: user,
    });

    expect(categoryService.create).toHaveBeenCalledTimes(1);
  });

  it('should update a category', async () => {
    jest.spyOn(categoryService, 'update').mockImplementation(async () => {
      return {
        id: '1',
        name: 'cateogryUpdated1',
        color: 'categoryColor1',
        user: user,
      };
    });

    expect(
      await categoryResolver.updateCategory(
        { id: '1', name: 'cateogryUpdated1', color: 'categoryColor1' },
        user,
      ),
    ).toEqual({
      id: '1',
      name: 'cateogryUpdated1',
      color: 'categoryColor1',
      user: user,
    });

    expect(categoryService.update).toHaveBeenCalledTimes(1);
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

    expect(await categoryResolver.removeCategory('1', user)).toEqual({
      id: '1',
      name: 'categoryName1',
      color: 'categoryColor1',
      user: user,
    });
    expect(categoryService.remove).toHaveBeenCalledTimes(1);
  });
});
