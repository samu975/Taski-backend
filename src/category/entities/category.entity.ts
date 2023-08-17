import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Task } from '../../task/entities/task.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Task, (task) => task.category)
  @Field(() => [Task], { nullable: true })
  tasks?: Task[];
}
