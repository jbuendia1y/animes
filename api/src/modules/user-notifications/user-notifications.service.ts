import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserNotification, UserNotificationDocument } from './entities/user-notification.entity';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectModel(UserNotification.name)
    private notificationModel: Model<UserNotificationDocument>,
  ) {}

  async findAll(userId: string, page: number = 1, limit: number = 25) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.notificationModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async create(createDto: CreateUserNotificationDto): Promise<UserNotification> {
    const created = new this.notificationModel({
      userId: new Types.ObjectId(createDto.userId),
      title: createDto.title,
      description: createDto.description,
      imageLink: createDto.imageLink,
      link: createDto.link,
      viewed: false,
    });
    return created.save();
  }

  async markAsViewed(id: string): Promise<void> {
    await this.notificationModel.findByIdAndUpdate(id, { viewed: true });
  }

  async delete(id: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(id);
  }
}
