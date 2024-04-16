import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import{ Document } from 'mongoose'

@Schema()
export class Message extends Document {
  
  @Prop({ type: String, required: true })
  message: string;
  
  @Prop({ type: String, required: true })
  from: string;
  
  @Prop({ type: String, required: true })
  clientNumber: string;
  
  @Prop({ type: String, required: true })
  threadId: string;
  
  @Prop({ type: Number, required: true })
  tokens: number;

  @Prop({ type: String, required: true })
  createdAt: string;

}

export const MessageSchema = SchemaFactory.createForClass( Message )
