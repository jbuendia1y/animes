import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnimeDocument = Anime & Document;

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

@Schema()
class AnimeTag {
  @Prop()
  id: string;

  @Prop()
  slug: string;

  @Prop({ type: IntlText })
  name: IntlText;
}

@Schema({ timestamps: true })
export class Anime {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: IntlText })
  titles: IntlText;

  @Prop()
  canonicalTitle: string;

  @Prop()
  synopsis: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  stars: { [key: number]: number };

  @Prop({ type: [AnimeTag] })
  tags: AnimeTag[];

  @Prop()
  posterImage: string;

  @Prop()
  coverImage: string;

  @Prop({ default: false })
  nsfw: boolean;

  @Prop()
  status: string;

  @Prop()
  showType: string;
}

export const AnimeSchema = SchemaFactory.createForClass(Anime);
