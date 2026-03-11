import { Test, TestingModule } from '@nestjs/testing';
import { UserAnimesController } from './user-animes.controller';
import { UserAnimesService } from './user-animes.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { UserAnime } from './entities/user-anime.entity';
import { Types } from 'mongoose';
import { CreateUserAnimeDto, UserAnimeQueryDto } from './dto/user-anime.dto';

describe('UserAnimesController', () => {
  let controller: UserAnimesController;
  let userAnimesService: UserAnimesService;

  const userId = new Types.ObjectId().toString();
  const mockUserAnime = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    userId,
    animeId: new Types.ObjectId().toString(),
  };

  const mockUserAnimesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAnimesController],
      providers: [
        { provide: UserAnimesService, useValue: mockUserAnimesService },
        { provide: getModelToken(UserAnime.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserAnimesController>(UserAnimesController);
    userAnimesService = module.get<UserAnimesService>(UserAnimesService);
    jest.clearAllMocks();
  });

  const currentUser = { id: userId, username: 'testuser', isAdmin: false };

  describe('findAll', () => {
    it('should return paginated list of user animes', async () => {
      const query: UserAnimeQueryDto = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [mockUserAnime],
        meta: { total: 1 },
      };

      mockUserAnimesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(currentUser, query);

      expect(mockUserAnimesService.findAll).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(expectedResponse);
    });

    it('should filter by animeId', async () => {
      const query: UserAnimeQueryDto = { animeId: mockUserAnime.animeId };
      const expectedResponse = {
        data: [mockUserAnime],
        meta: { total: 1 },
      };

      mockUserAnimesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(currentUser, query);

      expect(mockUserAnimesService.findAll).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('create', () => {
    it('should create a new user anime', async () => {
      const createDto: CreateUserAnimeDto = {
        animeId: mockUserAnime.animeId,
      };

      mockUserAnimesService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        userId,
        ...createDto,
      });

      const result = await controller.create(currentUser, createDto);

      expect(mockUserAnimesService.create).toHaveBeenCalledWith(userId, createDto);
      expect(result.animeId).toEqual(createDto.animeId);
    });
  });

  describe('delete', () => {
    it('should delete a user anime', async () => {
      const animeId = mockUserAnime._id.toString();

      mockUserAnimesService.delete.mockResolvedValue(undefined);

      await controller.delete(currentUser, animeId);

      expect(mockUserAnimesService.delete).toHaveBeenCalledWith(animeId, userId);
    });

    it('should throw NotFoundException when user anime does not exist', async () => {
      const animeId = new Types.ObjectId().toString();

      mockUserAnimesService.delete.mockRejectedValue(
        new NotFoundException('User anime not found'),
      );

      await expect(controller.delete(currentUser, animeId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
