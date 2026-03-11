import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserNotificationDocument = UserNotification & Document;

@Schema({ timestamps: true })
export class UserNotification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageLink: string;

  @Prop()
  link: string;

  @Prop({ default: false })
  viewed: boolean;
}

export const UserNotificationSchema = SchemaFactory.createForClass(UserNotification);
