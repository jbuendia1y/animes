import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChapterDocument = Chapter & Document;

@Schema()
class IntlText {
  @Prop()
  en?: string;
  @Prop()
  es?: string;
  @Prop()
  en_jp?: string;
  @Prop()
  ja_jp?: string;
}

@Schema({ timestamps: true })
export class Chapter {
  @Prop()
  canonicalTitle: string;

  @Prop({ type: IntlText })
  titles: IntlText;

  @Prop()
  synopsis: string;

  @Prop()
  description: string;

  @Prop()
  number: number;

  @Prop()
  airdate: string;

  @Prop()
  thumbnail: string;

  @Prop({ required: true })
  animeId: string;
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
