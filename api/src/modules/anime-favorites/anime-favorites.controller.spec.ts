import { Test, TestingModule } from '@nestjs/testing';
import { AnimeFavoritesController } from './anime-favorites.controller';
import { AnimeFavoritesService } from './anime-favorites.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AnimeFavorite } from './entities/anime-favorite.entity';
import { Types } from 'mongoose';
import {
  CreateAnimeFavoriteDto,
  UpdateAnimeFavoriteDto,
  AnimeFavoriteQueryDto,
} from './dto/anime-favorite.dto';

describe('AnimeFavoritesController', () => {
  let controller: AnimeFavoritesController;
  let animeFavoritesService: AnimeFavoritesService;

  const userId = new Types.ObjectId().toString();
  const mockFavorite = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    userId,
    animeId: new Types.ObjectId().toString(),
    stars: 5,
  };

  const mockAnimeFavoritesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimeFavoritesController],
      providers: [
        { provide: AnimeFavoritesService, useValue: mockAnimeFavoritesService },
        { provide: getModelToken(AnimeFavorite.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<AnimeFavoritesController>(AnimeFavoritesController);
    animeFavoritesService = module.get<AnimeFavoritesService>(AnimeFavoritesService);
    jest.clearAllMocks();
  });

  const currentUser = { id: userId, username: 'testuser', isAdmin: false };

  describe('findAll', () => {
    it('should return paginated list of favorites', async () => {
      const query: AnimeFavoriteQueryDto = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [mockFavorite],
        meta: { total: 1 },
      };

      mockAnimeFavoritesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(currentUser, query);

      expect(mockAnimeFavoritesService.findAll).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(expectedResponse);
    });

    it('should filter favorites by animeId', async () => {
      const query: AnimeFavoriteQueryDto = { animeId: mockFavorite.animeId };
      const expectedResponse = {
        data: [mockFavorite],
        meta: { total: 1 },
      };

      mockAnimeFavoritesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(currentUser, query);

      expect(mockAnimeFavoritesService.findAll).toHaveBeenCalledWith(userId, query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('create', () => {
    it('should create a new favorite', async () => {
      const createDto: CreateAnimeFavoriteDto = {
        animeId: mockFavorite.animeId,
        stars: 4,
      };

      mockAnimeFavoritesService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        userId,
        ...createDto,
      });

      const result = await controller.create(currentUser, createDto);

      expect(mockAnimeFavoritesService.create).toHaveBeenCalledWith(userId, createDto);
      expect(result.animeId).toEqual(createDto.animeId);
    });
  });

  describe('update', () => {
    it('should update an existing favorite', async () => {
      const favoriteId = mockFavorite._id.toString();
      const updateDto: UpdateAnimeFavoriteDto = { stars: 3 };
      const updatedFavorite = { ...mockFavorite, stars: 3 };

      mockAnimeFavoritesService.update.mockResolvedValue(updatedFavorite);

      const result = await controller.update(currentUser, favoriteId, updateDto);

      expect(mockAnimeFavoritesService.update).toHaveBeenCalledWith(
        favoriteId,
        userId,
        updateDto,
      );
      expect(result.stars).toBe(3);
    });

    it('should throw NotFoundException when favorite does not exist', async () => {
      const favoriteId = new Types.ObjectId().toString();
      const updateDto: UpdateAnimeFavoriteDto = { stars: 3 };

      mockAnimeFavoritesService.update.mockRejectedValue(
        new NotFoundException('Favorite not found'),
      );

      await expect(
        controller.update(currentUser, favoriteId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      const favoriteId = mockFavorite._id.toString();
      const updateDto: UpdateAnimeFavoriteDto = { stars: 3 };

      mockAnimeFavoritesService.update.mockRejectedValue(
        new ForbiddenException('Not authorized'),
      );

      await expect(
        controller.update(currentUser, favoriteId, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a favorite', async () => {
      const favoriteId = mockFavorite._id.toString();

      mockAnimeFavoritesService.delete.mockResolvedValue(undefined);

      await controller.delete(currentUser, favoriteId);

      expect(mockAnimeFavoritesService.delete).toHaveBeenCalledWith(favoriteId, userId);
    });

    it('should throw NotFoundException when favorite does not exist', async () => {
      const favoriteId = new Types.ObjectId().toString();

      mockAnimeFavoritesService.delete.mockRejectedValue(
        new NotFoundException('Favorite not found'),
      );

      await expect(controller.delete(currentUser, favoriteId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not owner', async () => {
      const favoriteId = mockFavorite._id.toString();

      mockAnimeFavoritesService.delete.mockRejectedValue(
        new ForbiddenException('Not authorized'),
      );

      await expect(controller.delete(currentUser, favoriteId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
