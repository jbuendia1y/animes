import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimeFavoriteDocument = AnimeFavorite & Document;

@Schema({ timestamps: true })
export class AnimeFavorite {
  @Prop({ required: true })
  stars: number;

  @Prop({ required: true })
  animeId: string;

  @Prop({ required: true })
  userId: string;
}

export const AnimeFavoriteSchema = SchemaFactory.createForClass(AnimeFavorite);
