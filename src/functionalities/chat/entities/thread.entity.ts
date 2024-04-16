import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import{ Document } from 'mongoose'

@Schema()
export class Thread extends Document {

  @Prop({ type: String, required: true })
  clientNumber: string;
  
  @Prop({ type: String, required: true })
  threadId: string;
}

export const ThreadSchema = SchemaFactory.createForClass( Thread )
