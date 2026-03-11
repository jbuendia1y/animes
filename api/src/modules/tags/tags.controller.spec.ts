import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Tag } from './entities/tag.entity';
import { Types } from 'mongoose';
import { CreateTagDto, TagQueryDto } from './dto/tag.dto';

describe('TagsController', () => {
  let controller: TagsController;
  let tagsService: TagsService;

  const mockTag = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    slug: 'action',
    name: { en: 'Action', es: 'Acción' },
    description: { en: 'Action genre', es: 'Género de acción' },
    nsfw: false,
  };

  const mockTagsService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        { provide: TagsService, useValue: mockTagsService },
        { provide: getModelToken(Tag.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    tagsService = module.get<TagsService>(TagsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated list of tags', async () => {
      const query: TagQueryDto = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [mockTag],
        meta: { total: 1 },
      };

      mockTagsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockTagsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should filter tags by slug', async () => {
      const query: TagQueryDto = { slug: 'action' };
      const expectedResponse = {
        data: [mockTag],
        meta: { total: 1 },
      };

      mockTagsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(mockTagsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should return empty list when no tags exist', async () => {
      const query: TagQueryDto = {};
      const expectedResponse = {
        data: [],
        meta: { total: 0 },
      };

      mockTagsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto: CreateTagDto = {
        slug: 'comedy',
        name: { en: 'Comedy' },
        description: { en: 'Comedy genre' },
      };

      mockTagsService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createTagDto,
        nsfw: false,
      });

      const result = await controller.create(createTagDto);

      expect(mockTagsService.create).toHaveBeenCalledWith(createTagDto);
      expect(result.slug).toEqual(createTagDto.slug);
    });

    it('should throw ConflictException on duplicate slug', async () => {
      const createTagDto: CreateTagDto = {
        slug: 'existing-tag',
        name: { en: 'Existing Tag' },
        description: { en: 'Description' },
      };

      mockTagsService.create.mockRejectedValue(
        new ConflictException('Tag with this slug already exists'),
      );

      await expect(controller.create(createTagDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
