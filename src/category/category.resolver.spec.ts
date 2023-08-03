import { Test, TestingModule } from '@nestjs/testing';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { Category } from './entities/category.entity';
import { User } from 'src/users/entities/user.entity';
describe('CategoryResolver', () => {
  let resolver: CategoryResolver;
  let service: CategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryResolver, CategoryService],
    }).compile();
    resolver = module.get<CategoryResolver>(CategoryResolver);
    service = module.get<CategoryService>(CategoryService);
  });
  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createCategoryInput: CreateCategoryInput = {
        name: 'Test Category',
      };
      const user: User = {
        id: '',
        email: '',
        password: '',
        isActive: false,
        name: '',
        lastname: '',
      };
      const expectedResult: Category = {
        id: '1',
        name: 'Test Category',
      };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
      const result = await resolver.createCategory(createCategoryInput, user);
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createCategoryInput, user);
    });
    it('should throw an error if user is not authenticated', async () => {
      const createCategoryInput: CreateCategoryInput = {
        name: 'Test Category',
      };
      const user: User = null;
      await expect(
        resolver.createCategory(createCategoryInput, user),
      ).rejects.toThrowError('Unauthorized');
    });
  });
});
