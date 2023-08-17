import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Task } from '../task/entities/task.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
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

    category.name = updateCategoryInput.name || category.name;
    category.color = updateCategoryInput.color || category.color;

    category.user = user;

    return this.categoryRepository.save(category);
  }

  async remove(id: string, user: User) {
    const category = await this.findOne(id, user);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.taskRepository.remove(category.tasks);

    return this.categoryRepository.remove(category);
  }
}
