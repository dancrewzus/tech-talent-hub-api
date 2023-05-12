import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Exercise extends Document {
  
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;
  
  @Prop({ type: String, required: true })
  description: string;
  
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, default: Date.now().toString(), index: true })
  createdAt?: string;
  
  @Prop({ type: String, default: Date.now().toString(), index: true })
  updatedAt?: string;
}

export const ExerciseSchema = SchemaFactory.createForClass( Exercise )
