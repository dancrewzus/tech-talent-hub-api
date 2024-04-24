import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Caracas')

@Schema()
export class Notification extends Document {

  @Prop({ type: String, required: false })
  @ApiProperty({
    example: 'Haz recibido una nueva postulación.',
    description: 'Notification title',
    uniqueItems: true
  })
  title: string;
  
  @Prop({ type: String, required: false })
  @ApiProperty({
    example: 'El usuario adumbledore ha postulado en una de tus publicaciones.',
    description: 'Notification description',
    uniqueItems: true
  })
  message: string;
  
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String, default: '' })
  code: string;

  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Deletion date.' })
  @Prop({ type: String, default: null, nullable: true })
  deletedAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass( Notification )
