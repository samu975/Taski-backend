import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  lastname: string;
}
