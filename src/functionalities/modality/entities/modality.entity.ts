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

dayjs.tz.setDefault('America/Manaus')

import { User } from 'src/functionalities/users/entities/user.entity';

@Schema()
export class Modality extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
  
  @ApiProperty({ example: '10% 4d', description: 'Title' })
  @Prop({ type: String, required: true })
  title: string;
  
  @ApiProperty({ example: '10-4', description: 'Value' })
  @Prop({ type: String, required: true })
  value: string;

  @ApiProperty({ type: Number, description: 'Percent', example: 10 })
  @Prop({ type: Number, required: true })
  percent: number;

  @ApiProperty({ type: Number, description: 'Days', example: 4 })
  @Prop({ type: Number, required: true })
  days: number;

  @ApiProperty({ type: Boolean, description: 'Accept days off?', example: true })
  @Prop({ type: Boolean, default: false })
  offDays: boolean;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
}

export const ModalitySchema = SchemaFactory.createForClass( Modality )