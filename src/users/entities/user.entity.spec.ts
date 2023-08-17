import { User } from './user.entity';
import { Category } from '../../category/entities/category.entity';
import { Task } from '../../task/entities/task.entity';

describe('User', () => {
  const user = new User();
  user.id = '1';
  user.name = 'test';
  user.email = 'test@testing.com';
  user.lastname = 'test';
  user.password = 'test';
  user.tasks = [];
  user.categories = [];
  user.isActive = true;

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have properties', () => {
    expect(user.id).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.lastname).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.tasks).toBeDefined();
    expect(user.categories).toBeDefined();
    expect(user.isActive).toBeDefined();
  });

  it('should have correct types', () => {
    expect(typeof user.id).toBe('string');
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.lastname).toBe('string');
    expect(typeof user.password).toBe('string');
    expect(typeof user.tasks).toBe('object');
    expect(typeof user.categories).toBe('object');
    expect(typeof user.isActive).toBe('boolean');
  });

  it('should have correct relationships', () => {
    const task = new Task();
    const category = new Category();

    user.categories.push(category);
    user.tasks.push(task);

    expect(user.categories[0]).toBeInstanceOf(Category);
    expect(user.tasks[0]).toBeInstanceOf(Task);
  });
});
