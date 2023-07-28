import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs';
import { AuthResponse } from './types/authtype';
import { LoginInput } from './dto/inputs/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(@Args('signupInput') signupInput: SignUpInput) {
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  // no incluir, no se necesita, dejarlo hasta subir al repo final porque sirve como ejemplo
  // @Query(() => AuthResponse, { name: 'revalidateToken' })
  // @UseGuards(JwtAuthGuard)
  // async revalidateToken(@CurrentUser() user: User) {
  //   console.log(user);
  //   throw new Error('Not implemented');
  // }
}
