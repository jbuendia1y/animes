import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  locale: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
