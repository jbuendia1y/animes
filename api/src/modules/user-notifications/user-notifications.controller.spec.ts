import { Test, TestingModule } from '@nestjs/testing';
import { UserNotificationsController } from './user-notifications.controller';
import { UserNotificationsService } from './user-notifications.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserNotification } from './entities/user-notification.entity';
import { Types } from 'mongoose';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';

describe('UserNotificationsController', () => {
  let controller: UserNotificationsController;
  let notificationsService: UserNotificationsService;

  const userId = new Types.ObjectId().toString();
  const mockNotification = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    userId: new Types.ObjectId(userId),
    title: 'New Chapter',
    description: 'Chapter 5 has been released',
    imageLink: 'https://example.com/image.jpg',
    link: '/anime/one-piece/5',
    viewed: false,
  };

  const mockNotificationsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    markAsViewed: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNotificationsController],
      providers: [
        { provide: UserNotificationsService, useValue: mockNotificationsService },
        { provide: getModelToken(UserNotification.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserNotificationsController>(UserNotificationsController);
    notificationsService = module.get<UserNotificationsService>(UserNotificationsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated list of user notifications', async () => {
      const expectedResponse = {
        data: [mockNotification],
        meta: { total: 1, page: 1, limit: 25 },
      };

      mockNotificationsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(userId, '1', '25');

      expect(mockNotificationsService.findAll).toHaveBeenCalledWith(userId, 1, 25);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle pagination parameters', async () => {
      const expectedResponse = {
        data: [],
        meta: { total: 0, page: 2, limit: 10 },
      };

      mockNotificationsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(userId, '2', '10');

      expect(mockNotificationsService.findAll).toHaveBeenCalledWith(userId, 2, 10);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const createDto: CreateUserNotificationDto = {
        userId,
        title: 'Test Notification',
        description: 'Test Description',
        imageLink: 'https://example.com/image.jpg',
        link: '/test',
      };

      mockNotificationsService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createDto,
        viewed: false,
      });

      const result = await controller.create(createDto);

      expect(mockNotificationsService.create).toHaveBeenCalledWith(createDto);
      expect(result.title).toEqual(createDto.title);
    });
  });

  describe('markAsViewed', () => {
    it('should mark a notification as viewed', async () => {
      const notificationId = mockNotification._id.toString();

      mockNotificationsService.markAsViewed.mockResolvedValue(undefined);

      await controller.markAsViewed(notificationId);

      expect(mockNotificationsService.markAsViewed).toHaveBeenCalledWith(notificationId);
    });
  });

  describe('delete', () => {
    it('should delete a notification', async () => {
      const notificationId = mockNotification._id.toString();

      mockNotificationsService.delete.mockResolvedValue(undefined);

      await controller.delete(notificationId);

      expect(mockNotificationsService.delete).toHaveBeenCalledWith(notificationId);
    });
  });
});
