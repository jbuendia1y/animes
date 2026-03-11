import { Test, TestingModule } from '@nestjs/testing';
import { AnimesController } from './animes.controller';
import { AnimesService } from './animes.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAnimeDto, UpdateAnimeDto, AnimeQueryDto } from './dto/anime.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Anime } from './entities/anime.entity';
import { Types } from 'mongoose';

describe('AnimesController', () => {
  let controller: AnimesController;
  let animesService: AnimesService;

  const mockAnime = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    slug: 'one-piece',
    titles: { en: 'One Piece', ja_jp: 'ワンピース' },
    canonicalTitle: 'One Piece',
    synopsis: 'Monkey D. Luffy sets off on an adventure...',
    description: 'A long description',
    stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    tags: [],
    posterImage: 'https://example.com/poster.jpg',
    coverImage: 'https://example.com/cover.jpg',
    nsfw: false,
    status: 'finished',
    showType: 'TV',
  };

  const mockAnimesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimesController],
      providers: [
        { provide: AnimesService, useValue: mockAnimesService },
        { provide: getModelToken(Anime.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<AnimesController>(AnimesController);
    animesService = module.get<AnimesService>(AnimesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated list of animes', async () => {
      const query: AnimeQueryDto = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [mockAnime],
        meta: { total: 1 },
      };

      mockAnimesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockAnimesService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should return empty list when no animes exist', async () => {
      const query: AnimeQueryDto = {};
      const expectedResponse = {
        data: [],
        meta: { total: 0 },
      };

      mockAnimesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResponse);
    });

    it('should filter animes by slug query', async () => {
      const query: AnimeQueryDto = { slug: 'one-piece' };
      const expectedResponse = {
        data: [mockAnime],
        meta: { total: 1 },
      };

      mockAnimesService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockAnimesService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single anime by id', async () => {
      const animeId = mockAnime._id.toString();

      mockAnimesService.findOne.mockResolvedValue(mockAnime);

      const result = await controller.findOne(animeId);

      expect(mockAnimesService.findOne).toHaveBeenCalledWith(animeId);
      expect(result).toEqual(mockAnime);
    });

    it('should return null for invalid id format', async () => {
      const invalidId = 'invalid-id';

      mockAnimesService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(invalidId);

      expect(mockAnimesService.findOne).toHaveBeenCalledWith(invalidId);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new anime', async () => {
      const createAnimeDto: CreateAnimeDto = {
        slug: 'new-anime',
        titles: { en: 'New Anime' },
        canonicalTitle: 'New Anime',
        synopsis: 'New synopsis',
        description: 'New description',
        showType: 'TV',
        status: 'ongoing',
        posterImage: 'https://example.com/poster.jpg',
        coverImage: 'https://example.com/cover.jpg',
      };

      mockAnimesService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createAnimeDto,
        stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        tags: [],
      });

      const result = await controller.create(createAnimeDto);

      expect(mockAnimesService.create).toHaveBeenCalledWith(createAnimeDto);
      expect(result.slug).toEqual(createAnimeDto.slug);
    });

    it('should throw ConflictException on duplicate slug', async () => {
      const createAnimeDto: CreateAnimeDto = {
        slug: 'existing-anime',
        titles: { en: 'Existing Anime' },
        canonicalTitle: 'Existing Anime',
        synopsis: 'Synopsis',
        description: 'Description',
        showType: 'TV',
        status: 'ongoing',
      };

      mockAnimesService.create.mockRejectedValue(
        new ConflictException('Anime with this slug already exists'),
      );

      await expect(controller.create(createAnimeDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing anime', async () => {
      const animeId = mockAnime._id.toString();
      const updateAnimeDto = {
        canonicalTitle: 'Updated Title',
      };
      const updatedAnime = { ...mockAnime, canonicalTitle: 'Updated Title' };

      mockAnimesService.update.mockResolvedValue(updatedAnime);

      const result = await controller.update(animeId, updateAnimeDto);

      expect(mockAnimesService.update).toHaveBeenCalledWith(
        animeId,
        updateAnimeDto,
      );
      expect(result.canonicalTitle).toBe('Updated Title');
    });

    it('should throw NotFoundException when anime does not exist', async () => {
      const animeId = new Types.ObjectId().toString();
      const updateAnimeDto = { canonicalTitle: 'New Title' };

      mockAnimesService.update.mockRejectedValue(
        new NotFoundException('Anime not found'),
      );

      await expect(controller.update(animeId, updateAnimeDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
