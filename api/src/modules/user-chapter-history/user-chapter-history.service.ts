import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserChapterHistory, UserChapterHistoryDocument } from './entities/user-chapter-history.entity';
import { CreateUserChapterHistoryDto } from './dto/create-user-chapter-history.dto';

@Injectable()
export class UserChapterHistoryService {
  constructor(
    @InjectModel(UserChapterHistory.name)
    private historyModel: Model<UserChapterHistoryDocument>,
  ) {}

  async findAll(userId: string, page: number = 1, limit: number = 25) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.historyModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('chapterId')
        .exec(),
      this.historyModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async create(createDto: CreateUserChapterHistoryDto): Promise<UserChapterHistory> {
    const created = new this.historyModel({
      userId: new Types.ObjectId(createDto.userId),
      chapterId: new Types.ObjectId(createDto.chapterId),
    });
    return created.save();
  }

  async delete(id: string): Promise<void> {
    await this.historyModel.findByIdAndDelete(id);
  }
}
