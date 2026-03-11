import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    username: 'testuser',
    password: 'hashedpassword',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    isAdmin: false,
    locale: 'en',
  };

  const mockUsersService = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    createExposedUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        email: 'new@example.com',
        name: 'New User',
      };

      mockUsersService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createUserDto,
        isAdmin: false,
        avatar: null,
      });

      const result = await controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result.username).toEqual(createUserDto.username);
    });

    it('should throw ConflictException on duplicate username', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'password123',
      };

      mockUsersService.create.mockRejectedValue(
        new ConflictException('This username is already taken'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = mockUser._id.toString();

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      const userId = new Types.ObjectId().toString();

      mockUsersService.findById.mockResolvedValue(null);

      const result = await controller.findOne(userId);

      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = mockUser._id.toString();
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const userId = new Types.ObjectId().toString();
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      mockUsersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return exposed user profile', async () => {
      const currentUser = {
        id: mockUser._id.toString(),
        username: mockUser.username,
        isAdmin: false,
      };

      const exposedUser = {
        id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        name: mockUser.name,
        avatar: mockUser.avatar,
        isAdmin: mockUser.isAdmin,
        locale: mockUser.locale,
      };

      mockUsersService.createExposedUser.mockReturnValue(exposedUser);

      const result = controller.getProfile(currentUser as any);

      expect(result).toEqual(exposedUser);
    });
  });
});
