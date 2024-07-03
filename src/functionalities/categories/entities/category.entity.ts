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

dayjs.tz.setDefault('America/Caracas')

import { User } from '../../users/entities/user.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema()
export class Category extends Document {
  
  @ApiProperty({ description: 'Category name', example: 'Frontend Developer' })
  @Prop({ type: String, required: true })
  name: string;
  
  @ApiProperty({ description: 'Category name slug', example: 'frontend-developer' })
  @Prop({ type: String, required: true })
  slug: string;
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy: User;

  @ApiProperty({ example: '01/01/1900 00:00:00', description: 'Deletion date.' })
  @Prop({ type: String, default: null, nullable: true })
  deletedAt?: string;
  
  @ApiProperty({ example: '01/01/1900 00:00:00', description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: '01/01/1900 00:00:00', description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
  
  @ApiProperty({ example: false, description: 'Soft delete' })
  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass( Category )
CategorySchema.plugin(mongoosePaginate)

