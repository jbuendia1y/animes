import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { AnimeFavoritesService } from './anime-favorites.service';
import { AnimeFavorite } from './entities/anime-favorite.entity';
import { Anime } from '../animes/entities/anime.entity';
import { Types } from 'mongoose';

describe('AnimeFavoritesService Events', () => {
  let service: AnimeFavoritesService;
  let eventEmitter: EventEmitter2;

  const mockAnimeFavoriteModel = {
    find: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(0),
    }),
    deleteOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    }),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimeFavoritesService,
        { provide: getModelToken(AnimeFavorite.name), useValue: mockAnimeFavoriteModel },
        { provide: getModelToken(Anime.name), useValue: {} },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<AnimeFavoritesService>(AnimeFavoritesService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should emit anime-favorite.created event when favorite is created', async () => {
      const userId = new Types.ObjectId().toString();
      const animeId = new Types.ObjectId().toString();
      const createDto = { animeId, stars: 5 };

      const created = {
        _id: new Types.ObjectId(),
        userId,
        animeId,
        stars: 5,
      };

      jest.spyOn(mockAnimeFavoriteModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      mockAnimeFavoriteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const ModelMock = jest.fn().mockImplementation(() => ({
        ...createDto,
        userId,
        save: jest.fn().mockResolvedValue(created),
      }));

      (service as any).animeFavoriteModel = ModelMock;

      await service.create(userId, createDto);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'anime-favorite.created',
        { animeId, stars: 5 },
      );
    });
  });

  describe('update', () => {
    it('should emit anime-favorite.updated event when favorite is updated', async () => {
      const favoriteId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      const animeId = new Types.ObjectId().toString();

      const existingFavorite = {
        _id: new Types.ObjectId(favoriteId),
        userId,
        animeId,
        stars: 3,
        save: jest.fn().mockResolvedValue({
          _id: new Types.ObjectId(favoriteId),
          userId,
          animeId,
          stars: 5,
        }),
      };

      mockAnimeFavoriteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingFavorite),
      });

      await service.update(favoriteId, userId, { stars: 5 });

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'anime-favorite.updated',
        {
          before: { animeId, stars: 3 },
          toUpdateData: { stars: 5 },
        },
      );
    });
  });

  describe('delete', () => {
    it('should emit anime-favorite.deleted event when favorite is deleted', async () => {
      const favoriteId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      const animeId = new Types.ObjectId().toString();

      const existingFavorite = {
        _id: new Types.ObjectId(favoriteId),
        userId,
        animeId,
        stars: 4,
      };

      mockAnimeFavoriteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingFavorite),
      });

      await service.delete(favoriteId, userId);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'anime-favorite.deleted',
        { animeId, stars: 4 },
      );
    });
  });
});
