import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => UsersService))
    private taskService: UsersService,
  ) {}

  async create(createCategoryInput: CreateCategoryInput, user: User) {
    const newCategory = this.categoryRepository.create({
      ...createCategoryInput,
      user,
    });
    newCategory.user = user;
    return this.categoryRepository.save(newCategory);
  }

  async findAll(user: User): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      where: { user },
      relations: ['tasks'],
    });
    categories.forEach((category) => {
      category.user = user;
    });
    return categories;
  }

  async findOne(id: string, user: User): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      relations: ['tasks'],
      where: {
        id: id,
        user: { id: user.id },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    category.user = user;

    return category;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
    user: User,
  ) {
    const category = await this.findOne(id, user);

    if (!category) {
      return new NotFoundException(`Category with ID ${id} not found`);
    }

    const categoryUpdated = await this.categoryRepository.preload({
      ...updateCategoryInput,
      id,
    });

    categoryUpdated.user = user;

    return this.categoryRepository.save(categoryUpdated);
  }

  async remove(id: string, user: User) {
    const category = await this.findOne(id, user);

    if (!category) {
      return new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoryRepository.remove(category);
  }
}
