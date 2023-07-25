import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  color?: string;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user?: User;

  @ManyToMany(() => Task, (task) => task.categories)
  @Field(() => [Task], { nullable: true })
  tasks?: Task[];
}
