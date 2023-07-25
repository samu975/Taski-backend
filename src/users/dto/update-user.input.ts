import { IsBoolean, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  isActive?: boolean;
}
