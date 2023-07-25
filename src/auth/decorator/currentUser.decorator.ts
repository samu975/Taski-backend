import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user;

  if (!user) {
    throw new InternalServerErrorException(
      'No usaste el decorador use guard en el resolver',
    );
  }

  return user;
});
