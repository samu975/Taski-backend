import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { UsersService } from 'src/users/users.service';
// id pruebas: 913c95ba-6781-4ef9-85f7-bb79b9bfc9a8
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    const { userId } = createCategoryInput;
    const user = await this.userService.findOne(userId);
    const newCategory = this.categoryRepository.create({
      ...createCategoryInput,
      user,
    });
    return this.categoryRepository.save(newCategory);
  }

  async findAll(user: User, paginationArgs: PaginationArgs) {
    const { limit, offset } = paginationArgs;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where({ user: user.id });
    const [categories, count] = await queryBuilder.getManyAndCount();
    console.log('categories', categories);
    return categories;
  }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryInput: UpdateCategoryInput) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
