import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignUpInput } from './dto/inputs';
import { LoginInput } from './dto/inputs/login.input';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });
  describe('signup', () => {
    it('should create a new user and return success message', async () => {
      const signupInput: SignUpInput = {
        email: '',
        password: '',
        name: '',
        lastname: '',
      };
      const newUser: User = {
        id: '',
        email: '',
        password: '',
        isActive: false,
        name: '',
        lastname: '',
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(newUser);
      const result = await authService.signup(signupInput);
      expect(result).toEqual({
        message: 'User created',
        user: newUser,
      });
      expect(usersService.create).toHaveBeenCalledWith(signupInput);
    });
    it('should throw an error if user creation fails', async () => {
      const signupInput: SignUpInput = {
        email: '',
        password: '',
        name: '',
        lastname: '',
      };
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new Error('User creation failed'));
      await expect(authService.signup(signupInput)).rejects.toThrowError(
        'User creation failed',
      );
      expect(usersService.create).toHaveBeenCalledWith(signupInput);
    });
  });
  describe('login', () => {
    it('should return token and user if login is successful', async () => {
      const loginInput: LoginInput = {
        email: '',
        password: '',
      };
      const user: User = {
        id: '',
        email: '',
        password: '',
        isActive: false,
        name: '',
        lastname: '',
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(authService, 'getTocken').mockReturnValue('test_token');
      const result = await authService.login(loginInput);

      expect(result).toEqual({
        token: 'test_token',
        user: result,
        ...result,
      });

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        loginInput.password,
        user.password,
      );
      expect(authService.getTocken).toHaveBeenCalledWith(user.id);
    });
    it('should throw BadRequestException if password is invalid', async () => {
      const loginInput: LoginInput = {
        email: '',
        password: '',
      };
      const user: User = {
        id: '',
        email: '',
        password: '',
        isActive: false,
        name: '',
        lastname: '',
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      await expect(authService.login(loginInput)).rejects.toThrowError(
        BadRequestException,
      );
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        loginInput.password,
        user.password,
      );
    });
    it('should throw BadRequestException if login input is invalid', async () => {
      const loginInput: LoginInput = {
        email: '',
        password: '',
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      await expect(authService.login(loginInput)).rejects.toThrowError(
        BadRequestException,
      );
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
    });
  });
  describe('validateUser', () => {
    it('should return user if user is active', async () => {
      const user: User = {
        isActive: true,
        id: '',
        email: '',
        password: '',
        name: '',
        lastname: '',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      const result = await authService.validateUser('test_id');
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith('test_id');
    });
    it('should throw UnauthorizedException if user is not active', async () => {
      const user: User = {
        isActive: false,
        id: '',
        email: '',
        password: '',
        name: '',
        lastname: '',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      await expect(authService.validateUser('test_id')).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(usersService.findOne).toHaveBeenCalledWith('test_id');
    });
  });
});
