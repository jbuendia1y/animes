import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';
import { Anime } from '../animes/entities/anime.entity';
import { UserNotification } from '../user-notifications/entities/user-notification.entity';
import { AnimeFavorite } from '../anime-favorites/entities/anime-favorite.entity';
import { Types } from 'mongoose';

describe('ChaptersService Events', () => {
  let service: ChaptersService;
  let eventEmitter: EventEmitter2;

  const mockChapterModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
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
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        { provide: getModelToken(Chapter.name), useValue: mockChapterModel },
        { provide: getModelToken(Anime.name), useValue: {} },
        { provide: getModelToken(UserNotification.name), useValue: {} },
        { provide: getModelToken(AnimeFavorite.name), useValue: {} },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<ChaptersService>(ChaptersService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should emit chapter.created event when chapter is created', async () => {
      const createChapterDto = {
        canonicalTitle: 'Chapter 1',
        titles: { en: 'Chapter 1' },
        synopsis: 'Synopsis',
        description: 'Description',
        number: 1,
        airdate: '2024-01-01',
        animeId: new Types.ObjectId().toString(),
      };

      const createdChapter = {
        _id: new Types.ObjectId(),
        ...createChapterDto,
      };

      const ModelMock = jest.fn().mockImplementation(() => ({
        ...createChapterDto,
        save: jest.fn().mockResolvedValue(createdChapter),
      }));

      (service as any).chapterModel = ModelMock;

      await service.create(createChapterDto);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'chapter.created',
        expect.objectContaining({
          canonicalTitle: createChapterDto.canonicalTitle,
          number: createChapterDto.number,
          animeId: createChapterDto.animeId,
        }),
      );
    });
  });
});
