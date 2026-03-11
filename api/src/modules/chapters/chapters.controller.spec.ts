import { Test, TestingModule } from '@nestjs/testing';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Chapter } from './entities/chapter.entity';
import { Types } from 'mongoose';
import { CreateChapterDto, UpdateChapterDto, ChapterQueryDto } from './dto/chapter.dto';

describe('ChaptersController', () => {
  let controller: ChaptersController;
  let chaptersService: ChaptersService;

  const mockChapter = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    canonicalTitle: 'Chapter 1',
    titles: { en: 'Chapter 1', ja_jp: '第1話' },
    synopsis: 'A great chapter',
    description: 'A long description',
    number: 1,
    airdate: '2024-01-01',
    thumbnail: 'https://example.com/thumb.jpg',
    animeId: new Types.ObjectId().toString(),
  };

  const mockChaptersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChaptersController],
      providers: [
        { provide: ChaptersService, useValue: mockChaptersService },
        { provide: getModelToken(Chapter.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<ChaptersController>(ChaptersController);
    chaptersService = module.get<ChaptersService>(ChaptersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated list of chapters', async () => {
      const query: ChapterQueryDto = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [mockChapter],
        meta: { total: 1 },
      };

      mockChaptersService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockChaptersService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should return chapters filtered by animeId', async () => {
      const query: ChapterQueryDto = { animeId: mockChapter.animeId };
      const expectedResponse = {
        data: [mockChapter],
        meta: { total: 1 },
      };

      mockChaptersService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockChaptersService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should return empty list when no chapters exist', async () => {
      const query: ChapterQueryDto = {};
      const expectedResponse = {
        data: [],
        meta: { total: 0 },
      };

      mockChaptersService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single chapter by id', async () => {
      const chapterId = mockChapter._id.toString();

      mockChaptersService.findOne.mockResolvedValue(mockChapter);

      const result = await controller.findOne(chapterId);

      expect(mockChaptersService.findOne).toHaveBeenCalledWith(chapterId);
      expect(result).toEqual(mockChapter);
    });

    it('should return null for invalid id format', async () => {
      const invalidId = 'invalid-id';

      mockChaptersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(invalidId);

      expect(mockChaptersService.findOne).toHaveBeenCalledWith(invalidId);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new chapter', async () => {
      const createChapterDto: CreateChapterDto = {
        canonicalTitle: 'New Chapter',
        titles: { en: 'New Chapter' },
        synopsis: 'Synopsis',
        description: 'Description',
        number: 1,
        airdate: '2024-01-01',
        animeId: mockChapter.animeId,
      };

      mockChaptersService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createChapterDto,
      });

      const result = await controller.create(createChapterDto);

      expect(mockChaptersService.create).toHaveBeenCalledWith(createChapterDto);
      expect(result.canonicalTitle).toEqual(createChapterDto.canonicalTitle);
    });
  });

  describe('update', () => {
    it('should update an existing chapter', async () => {
      const chapterId = mockChapter._id.toString();
      const updateChapterDto: UpdateChapterDto = { number: 5 };
      const updatedChapter = { ...mockChapter, number: 5 };

      mockChaptersService.update.mockResolvedValue(updatedChapter);

      const result = await controller.update(chapterId, updateChapterDto);

      expect(mockChaptersService.update).toHaveBeenCalledWith(
        chapterId,
        updateChapterDto,
      );
      expect(result.number).toBe(5);
    });

    it('should throw NotFoundException when chapter does not exist', async () => {
      const chapterId = new Types.ObjectId().toString();
      const updateChapterDto: UpdateChapterDto = { number: 5 };

      mockChaptersService.update.mockRejectedValue(
        new NotFoundException('Chapter not found'),
      );

      await expect(controller.update(chapterId, updateChapterDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
