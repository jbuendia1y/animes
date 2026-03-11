import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAnimeDocument = UserAnime & Document;

@Schema({ timestamps: true })
export class UserAnime {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  animeId: string;
}

export const UserAnimeSchema = SchemaFactory.createForClass(UserAnime);
