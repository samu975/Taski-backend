import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(8)
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  lastname: string;
}
