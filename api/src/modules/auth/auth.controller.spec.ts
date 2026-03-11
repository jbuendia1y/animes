import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { User } from '../users/entities/user.entity';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    username: 'testuser',
    password: 'hashedpassword',
    email: 'test@example.com',
    name: 'Test User',
    avatar: null,
    isAdmin: false,
    locale: 'en',
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }])],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return user token on successful login', async () => {
      const loginDto = { username: 'testuser', password: 'password123' };
      const expectedResponse = {
        user: { id: mockUser._id, username: mockUser.username },
        token_type: 'Bearer',
        access_token: 'mock-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = { username: 'testuser', password: 'wrongpassword' };

      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('username or password was wrong'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should create a new user and return id and username', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'password123',
        email: 'new@example.com',
      };
      const expectedResponse = { id: mockUser._id, username: 'newuser' };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(createUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw ConflictException on duplicate username', async () => {
      const createUserDto = {
        username: 'existinguser',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(
        new ConflictException('This username is already taken'),
      );

      await expect(controller.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const currentUser = {
        id: mockUser._id.toString(),
        username: mockUser.username,
        isAdmin: false,
      };

      const result = controller.getProfile(currentUser);

      expect(result).toEqual({
        id: mockUser._id.toString(),
        username: mockUser.username,
        isAdmin: false,
      });
    });

    it('should return user with admin privileges', async () => {
      const adminUser = {
        id: mockUser._id.toString(),
        username: mockUser.username,
        isAdmin: true,
      };

      const result = controller.getProfile(adminUser);

      expect(result).toEqual({
        id: mockUser._id.toString(),
        username: mockUser.username,
        isAdmin: true,
      });
    });
  });
});
