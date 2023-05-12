import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Exercise } from 'src/app/exercises/entities/exercise.entity';

@Schema({ timestamps: true })
export class Training extends Document {
  
  @Prop({ type: Exercise, required: true })
  exercise: Exercise;
  
  @Prop({ type: Number, required: true })
  sets: Number;
  
  @Prop({ type: Number, required: true })
  reps: Number;
  
  @Prop({ type: Number, required: true })
  weight: Number;
}

export const TrainingSchema = SchemaFactory.createForClass( Training )
