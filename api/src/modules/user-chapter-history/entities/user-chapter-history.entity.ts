import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserChapterHistoryDocument = UserChapterHistory & Document;

@Schema({ timestamps: true })
export class UserChapterHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Chapter', required: true })
  chapterId: Types.ObjectId;
}

export const UserChapterHistorySchema = SchemaFactory.createForClass(UserChapterHistory);
