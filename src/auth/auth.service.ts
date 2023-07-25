import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpInput } from './dto/inputs';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  getTocken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignUpInput) {
    try {
      const newUser = await this.usersService.create(signupInput);
      return {
        message: 'User created',
        user: newUser,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(loginInput: LoginInput) {
    try {
      const { email, password } = loginInput;
      const user = this.usersService.findOneByEmail(email);
      const token = this.getTocken((await user).id);

      if (!bcrypt.compareSync(password, (await user).password)) {
        throw new BadRequestException('Invalid password');
      }

      return {
        token,
        user,
      };
    } catch (error) {}
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    delete user.password;

    return user;
  }
}
