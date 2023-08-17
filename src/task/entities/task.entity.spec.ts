import { Test, TestingModule } from '@nestjs/testing';
import { Task } from './task.entity';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../users/entities/user.entity';

describe('Task', () => {
  let task: Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Task],
    }).compile();

    task = module.get<Task>(Task);
  });

  describe('id', () => {
    it('should return the id of the task', () => {
      const id = '123456';
      task.id = id;
      expect(task.id).toEqual(id);
    });
  });

  describe('title', () => {
    it('should return the title of the task', () => {
      const title = 'Test Task';
      task.title = title;
      expect(task.title).toEqual(title);
    });
  });

  describe('description', () => {
    it('should return the description of the task', () => {
      const description = 'Test description';
      task.description = description;
      expect(task.description).toEqual(description);
    });
  });

  describe('status', () => {
    it('should return the status of the task', () => {
      const status = 'Completed';
      task.status = status;
      expect(task.status).toEqual(status);
    });
  });

  describe('expiredAt', () => {
    it('should return the expiredAt date of the task', () => {
      const expiredAt = new Date('2022-01-01');
      task.expiredAt = expiredAt;
      expect(task.expiredAt).toEqual(expiredAt);
    });
  });

  describe('user', () => {
    it('should return the user assigned to the task', () => {
      const user = new User();
      task.user = user;
      expect(task.user).toEqual(user);
    });
  });

  describe('category', () => {
    it('should return the category assigned to the task', () => {
      const category = new Category();
      task.category = category;
      expect(task.category).toEqual(category);
    });
  });
});
