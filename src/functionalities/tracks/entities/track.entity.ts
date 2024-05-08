import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Bogota')

import { User } from '../../users/entities/user.entity';

@Schema()
export class Track extends Document {
  
  @ApiProperty({ example: '192.168.0.100', description: 'Request IP' })
  @Prop({ type: String, required: true })
  ip: string;
  
  @ApiProperty({ example: 'User "Harry Potter" created', description: 'Event description' })
  @Prop({ type: String, required: true })
  description: string;
  
  @ApiProperty({ example: 'users', description: 'Module trigger' })
  @Prop({ type: String, required: true })
  module: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
 
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const TrackSchema = SchemaFactory.createForClass( Track )
