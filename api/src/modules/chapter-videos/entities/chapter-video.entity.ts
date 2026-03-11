import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChapterVideoDocument = ChapterVideo & Document;

@Schema({ timestamps: true })
export class ChapterVideo {
  @Prop()
  provider: string;

  @Prop()
  player: string;

  @Prop()
  videoURL: string;

  @Prop()
  embedURL: string;

  @Prop({ required: true })
  chapterId: string;
}

export const ChapterVideoSchema = SchemaFactory.createForClass(ChapterVideo);
