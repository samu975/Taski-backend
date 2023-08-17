import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  status?: string = 'OPEN';

  @Field(() => Date)
  @IsDate()
  expiredAt: Date = new Date();

  @Field(() => ID)
  categoryID: string;
}
