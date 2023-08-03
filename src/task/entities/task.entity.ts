import { ObjectType, Field, Int, ID, Query } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  status: string;

  @Column()
  @Field(() => Date)
  expiredAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Category, (category) => category.tasks, { cascade: true })
  @JoinColumn({ name: 'categoryId' })
  @Field(() => Category)
  category: Category;
}
