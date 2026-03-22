import { Test, TestingModule } from "@nestjs/testing";
import { UserChapterHistoryController } from "./user-chapter-history.controller";
import { UserChapterHistoryService } from "./user-chapter-history.service";
import { getModelToken } from "@nestjs/mongoose";
import { UserChapterHistory } from "./entities/user-chapter-history.entity";
import { Types } from "mongoose";
import { CreateUserChapterHistoryDto } from "./dto/create-user-chapter-history.dto";

describe("UserChapterHistoryController", () => {
  let controller: UserChapterHistoryController;
  let historyService: UserChapterHistoryService;

  const userId = new Types.ObjectId().toString();
  const mockUser = {
    id: userId,
    username: "MOCKED_USERNAME",
    isAdmin: true,
  };
  const mockHistory = {
    _id: new Types.ObjectId("507f1f77bcf86cd799439011"),
    userId: new Types.ObjectId(userId),
    chapterId: new Types.ObjectId(),
  };

  const mockHistoryService = {
    findAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChapterHistoryController],
      providers: [
        { provide: UserChapterHistoryService, useValue: mockHistoryService },
        { provide: getModelToken(UserChapterHistory.name), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserChapterHistoryController>(
      UserChapterHistoryController,
    );
    historyService = module.get<UserChapterHistoryService>(
      UserChapterHistoryService,
    );
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return paginated list of user chapter history", async () => {
      const expectedResponse = {
        data: [mockHistory],
        meta: { total: 1, page: 1, limit: 25 },
      };

      mockHistoryService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(mockUser, "1", "25");

      expect(mockHistoryService.findAll).toHaveBeenCalledWith(mockUser, 1, 25);
      expect(result).toEqual(expectedResponse);
    });

    it("should handle pagination parameters", async () => {
      const expectedResponse = {
        data: [],
        meta: { total: 0, page: 2, limit: 10 },
      };

      mockHistoryService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(mockUser, "2", "10");

      expect(mockHistoryService.findAll).toHaveBeenCalledWith(mockUser, 2, 10);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("create", () => {
    it("should create a new chapter history entry", async () => {
      const createDto: CreateUserChapterHistoryDto = {
        userId,
        chapterId: new Types.ObjectId().toString(),
      };

      mockHistoryService.create.mockResolvedValue({
        _id: new Types.ObjectId(),
        ...createDto,
      });

      const result = await controller.create(mockUser, createDto);

      expect(mockHistoryService.create).toHaveBeenCalledWith(createDto);
      expect(result.userId).toEqual(createDto.userId);
    });
  });

  describe("delete", () => {
    it("should delete a chapter history entry", async () => {
      const historyId = mockHistory._id.toString();

      mockHistoryService.delete.mockResolvedValue(undefined);

      await controller.delete(historyId);

      expect(mockHistoryService.delete).toHaveBeenCalledWith(historyId);
    });
  });
});
