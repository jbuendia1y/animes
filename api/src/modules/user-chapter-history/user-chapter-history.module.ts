import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserChapterHistoryController } from './user-chapter-history.controller';
import { UserChapterHistoryService } from './user-chapter-history.service';
import { UserChapterHistory, UserChapterHistorySchema } from './entities/user-chapter-history.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserChapterHistory.name, schema: UserChapterHistorySchema },
    ]),
  ],
  controllers: [UserChapterHistoryController],
  providers: [UserChapterHistoryService],
  exports: [UserChapterHistoryService],
})
export class UserChapterHistoryModule {}
