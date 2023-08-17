import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs';
import { AuthResponse } from './types/authtype';
import { LoginInput } from './dto/inputs/login.input';
import { NotFoundException } from '@nestjs/common';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and return the result', async () => {
      const signUpInput: SignUpInput = {
        name: 'test',
        lastname: 'test',
        email: 'test@testing.com',
        password: 'test',
      };
      const authResponse: AuthResponse = {
        token: 'test',
        user: {
          id: '1',
          name: 'test',
          lastname: 'test',
          email: 'test@testing.com',
          isActive: true,
          password: 'test',
        },
      };

      authService.signup = jest.fn().mockResolvedValue(authResponse);

      const result = await authResolver.signup(signUpInput);

      expect(result).toEqual(authResponse);
      expect(authService.signup).toHaveBeenCalledWith(signUpInput);
    });
  });

  describe('login', () => {
    it('should call authService.login and return the result', async () => {
      const loginInput: LoginInput = {
        email: 'test@testing.com',
        password: 'test',
      };
      const authResponse: AuthResponse = {
        token: 'test',
        user: {
          id: '1',
          name: 'test',
          lastname: 'test',
          email: 'test@testing.com',
          isActive: true,
          password: 'test',
        },
      };

      authService.login = jest.fn().mockResolvedValue(authResponse);

      const result = await authResolver.login(loginInput);

      expect(result).toEqual(authResponse);
      expect(authService.login).toHaveBeenCalledWith(loginInput);
    });
  });

  describe('errors', () => {
    it('should throw NotFoundException if signup throws an error', async () => {
      const signUpInput: SignUpInput = {
        email: 'test@testing.com',
        password: 'test',
        name: 'test',
        lastname: 'test',
      };

      authService.signup = jest.fn().mockRejectedValue(new NotFoundException());

      await expect(authResolver.signup(signUpInput)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if login throws an error', async () => {
      const loginInput: LoginInput = {
        email: 'test@testing.com',
        password: 'test',
      };

      authService.login = jest.fn().mockRejectedValue(new NotFoundException());

      await expect(authResolver.login(loginInput)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
