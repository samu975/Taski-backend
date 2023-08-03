import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs';
import { LoginInput } from './dto/inputs/login.input';

describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });
  describe('signup', () => {
    it('should return an AuthResponse object with a token on successful signup', async () => {
      const signupInput: SignUpInput = {
        email: 'pruebatest@test.com',
        password: 'pruebatest',
        name: 'prueba',
        lastname: 'test',
      };
      const result = await authService.signup(signupInput);
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
    });
    it('should throw an error on invalid signup input', async () => {
      const signupInput: SignUpInput = {
        email: 'pruebatest@test.com',
        password: 'pruebatest',
        name: '',
        lastname: '',
      };
      await expect(authService.signup(signupInput)).rejects.toThrow();
    });
  });
  describe('login', () => {
    it('should return an AuthResponse object with a token on successful login', async () => {
      const loginInput: LoginInput = {
        email: 'pruebatest@test.com',
        password: 'pruebatest',
      };
      const result = await authService.login(loginInput);
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
    });
    it('should throw an error on invalid login input', async () => {
      const loginInput: LoginInput = {
        email: 'pruebatest2@test.com',
        password: 'pruebatest2',
      };
      await expect(authService.login(loginInput)).rejects.toThrow();
    });
  });
});
