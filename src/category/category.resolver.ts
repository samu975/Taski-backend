import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.create(createCategoryInput, user);
  }

  @Query(() => [Category], { name: 'categories' })
  findAll(@CurrentUser() user: User) {
    return this.categoryService.findAll(user);
  }

  @Query(() => Category, { name: 'category' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.findOne(id, user);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
      user,
    );
  }

  @Mutation(() => Category)
  removeCategory(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.categoryService.remove(id, user);
  }
}
