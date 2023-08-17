import { Category } from './category.entity';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

describe('Category', () => {
  const category: Category = new Category();
  category.name = 'test';
  category.color = 'testColor';
  category.id = '1';
  category.user = new User();
  category.tasks = [];

  it('should be defined', () => {
    expect(category).toBeDefined();
  });

  it('should have properties', () => {
    expect(category).toHaveProperty('id');
    expect(category).toHaveProperty('name');
    expect(category).toHaveProperty('color');
    expect(category).toHaveProperty('user');
    expect(category).toHaveProperty('tasks');
  });

  it('should have correct types', () => {
    expect(category.id).toEqual(expect.any(String));
    expect(category.name).toEqual(expect.any(String));
    expect(category.color).toEqual(expect.any(String));
    expect(category.user).toBeInstanceOf(User);
    expect(category.tasks).toBeInstanceOf(Array);
    expect(category.tasks.length).toEqual(0);
  });

  it('should have correct relationships', () => {
    const user = new User();
    const task = new Task();

    category.user = user;
    category.tasks = [task];

    expect(category.user).toBe(user);
    expect(category.tasks).toContain(task);
  });
});
