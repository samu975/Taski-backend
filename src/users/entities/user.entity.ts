import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { Task } from 'src/task/entities/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  lastname: string;

  @OneToMany(() => Task, (tasks) => tasks.user)
  @Field(() => [Task], { nullable: true })
  tasks?: Task[];

  @OneToMany(() => Category, (category) => category.user)
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
