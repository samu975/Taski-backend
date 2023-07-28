import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CategoryService } from 'src/category/category.service';
import { Task } from '../task/entities/task.entity';
//27f42f77-d908-4eaf-aa43-a9c511880c9b
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...createUserInput,
        password: await bcrypt.hash(createUserInput.password, 10),
      });

      const savedUser = await this.userRepository.save(newUser);

      const newCategory = await this.categoryService.create(
        { name: 'Uncategorized', color: 'white' },
        newUser,
      );
      savedUser.categories = [newCategory];
      return this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['categories', 'tasks'],
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['categories', 'tasks'],
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['categories', 'tasks'],
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`No se pudo actualizar usuario, error: ${error}`);
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.delete(id);
      return `The user with id: ${id} has been deleted`;
    } catch (error) {
      throw new Error(`No se pudo eliminar usuario, error: ${error}`);
    }
  }
}
