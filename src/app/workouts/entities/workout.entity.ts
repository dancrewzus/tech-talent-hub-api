import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Training } from './training.entity';

@Schema({ timestamps: true })
export class Workout extends Document {
  
  @Prop({ type: String, required: true, index: true })
  user: string;
  
  @Prop({ type: String, required: true })
  comments: string;
  
  @Prop({ type: Array, required: true })
  exercises: Training[];

  @Prop({ type: String, default: Date.now().toString(), index: true })
  createdAt?: string;
  
  @Prop({ type: String, default: Date.now().toString(), index: true })
  updatedAt?: string;
}

export const WorkoutSchema = SchemaFactory.createForClass( Workout )
