import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TagDocument = Tag & Document;

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
export class Tag {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: IntlText })
  name: IntlText;

  @Prop({ type: IntlText })
  description: IntlText;

  @Prop({ default: false })
  nsfw: boolean;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
