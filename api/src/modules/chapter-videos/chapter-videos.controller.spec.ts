import { Test, TestingModule } from '@nestjs/testing';
import { ChapterVideosController } from './chapter-videos.controller';
import { ChapterVideosService } from './chapter-videos.service';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ChapterVideo } from './entities/chapter-video.entity';
import { Types } from 'mongoose';
import {
  CreateChapterVideoDto,
  UpdateChapterVideoDto,
  ChapterVideoQueryDto,
} from './dto/chapter-video.dto';

describe('ChapterVideosController', () => {
  let controller: ChapterVideosController;
  let chapterVideosService: ChapterVideosService;

  const mockChapterVideo = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    provider: 'youtube',
    player: 'default',
    videoURL: 'https://youtube.com/watch?v=abc',
    embedURL: 'https://youtube.com/embed/abc',
    chapterId: new Types.ObjectId().toString(),
  };

  const mockChapterVideosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterVideosController],
      providers: [
        { provide: ChapterVideosService, useValue: mockChapterVideosService },
        { provide: getModelToken(ChapterVideo.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<ChapterVideosController>(ChapterVideosController);
    chapterVideosService = module.get<ChapterVideosService>(ChapterVideosService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated list of chapter videos', async () => {
      const query: ChapterVideoQueryDto = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [mockChapterVideo],
        meta: { total: 1 },
      };

      mockChapterVideosService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockChapterVideosService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should filter by chapterId', async () => {
      const query: ChapterVideoQueryDto = { chapterId: mockChapterVideo.chapterId };
      const expectedResponse = {
        data: [mockChapterVideo],
        meta: { total: 1 },
      };

      mockChapterVideosService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockChapterVideosService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single chapter video by id', async () => {
      const videoId = mockChapterVideo._id.toString();

      mockChapterVideosService.findOne.mockResolvedValue(mockChapterVideo);

      const result = await controller.findOne(videoId);

      expect(mockChapterVideosService.findOne).toHaveBeenCalledWith(videoId);
      expect(result).toEqual(mockChapterVideo);
    });

    it('should return null for invalid id format', async () => {
      const invalidId = 'invalid-id';

      mockChapterVideosService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(invalidId);

      expect(mockChapterVideosService.findOne).toHaveBeenCalledWith(invalidId);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new chapter video', async () => {
      const createDto: CreateChapterVideoDto = {
        provider: 'youtube',
        player: 'default',
        videoURL: 'https://youtube.com/watch?v=xyz',
        chapterId: mockChapterVideo.chapterId,
      };

      mockChapterVideosService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createDto,
      });

      const result = await controller.create(createDto);

      expect(mockChapterVideosService.create).toHaveBeenCalledWith(createDto);
      expect(result.videoURL).toEqual(createDto.videoURL);
    });
  });

  describe('update', () => {
    it('should update an existing chapter video', async () => {
      const videoId = mockChapterVideo._id.toString();
      const updateDto: UpdateChapterVideoDto = { provider: 'vimeo' };
      const updatedVideo = { ...mockChapterVideo, provider: 'vimeo' };

      mockChapterVideosService.update.mockResolvedValue(updatedVideo);

      const result = await controller.update(videoId, updateDto);

      expect(mockChapterVideosService.update).toHaveBeenCalledWith(videoId, updateDto);
      expect(result.provider).toBe('vimeo');
    });

    it('should throw NotFoundException when video does not exist', async () => {
      const videoId = new Types.ObjectId().toString();
      const updateDto: UpdateChapterVideoDto = { provider: 'vimeo' };

      mockChapterVideosService.update.mockRejectedValue(
        new NotFoundException('Chapter video not found'),
      );

      await expect(controller.update(videoId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a chapter video', async () => {
      const videoId = mockChapterVideo._id.toString();

      mockChapterVideosService.delete.mockResolvedValue(undefined);

      await controller.delete(videoId);

      expect(mockChapterVideosService.delete).toHaveBeenCalledWith(videoId);
    });

    it('should throw NotFoundException when video does not exist', async () => {
      const videoId = new Types.ObjectId().toString();

      mockChapterVideosService.delete.mockRejectedValue(
        new NotFoundException('Chapter video not found'),
      );

      await expect(controller.delete(videoId)).rejects.toThrow(NotFoundException);
    });
  });
});
