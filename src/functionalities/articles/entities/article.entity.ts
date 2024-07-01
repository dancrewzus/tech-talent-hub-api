import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

import * as dayjs from 'dayjs';

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.tz.setDefault('America/Caracas');

import { User } from '../../users/entities/user.entity';

@Schema()
export class Article extends Document {
  
  @ApiProperty({ description: 'Article ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @Prop({ type: String, required: true, unique: true })
  id: string;
  
  @ApiProperty({ description: 'Article author', example: 'John Doe' })
  @Prop({ type: String, required: true })
  author: string;
  
  @ApiProperty({ description: 'Article title', example: 'The Future of Artificial Intelligence' })
  @Prop({ type: String, required: true })
  title: string;
  
  @ApiProperty({ description: 'Article slug', example: 'the-future-of-artificial-intelligence' })
  @Prop({ type: String, required: true })
  slug: string;
  
  @ApiProperty({ description: 'Article content', example: 'Artificial Intelligence (AI) is rapidly changing the world...' })
  @Prop({ type: String, required: true })
  content: string;
  
  @ApiProperty({ description: 'Array of article tags', example: ['AI', 'Technology', 'Future'] })
  @Prop({ type: [ String ], required: true })
  tags: string[];
  
  @ApiProperty({ description: 'Article category', example: 'Technology' })
  @Prop({ type: String, required: true })
  category: string;
  
  @ApiProperty({ description: 'Article area', example: 'Computer Science' })
  @Prop({ type: String, required: true })
  area: string;
  
  @ApiProperty({ description: 'Number of likes', example: 150 })
  @Prop({ type: Number, required: true, default: 0 })
  likes: number;
  
  @ApiProperty({ description: 'Article is featured', example: true })
  @Prop({ type: Boolean, required: true, default: false })
  isFeatured: boolean;
  
  @ApiProperty({ description: 'Article summary', example: 'This article discusses the impact of AI on society.' })
  @Prop({ type: String, required: true })
  summary: string;
  
  @ApiProperty({ description: 'Article creation date', example: '2023-04-15' })
  @Prop({ type: String, required: true })
  createdAt: string;
  
  @ApiProperty({ description: 'Article last update date', example: '2023-04-15' })
  @Prop({ type: String, required: true })
  updatedAt: string;
  
  @ApiProperty({ description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy: User;
  
  @ApiProperty({ description: 'Deletion date', example: '2023-04-15' })
  @Prop({ type: String, default: null, nullable: true })
  deletedAt?: string;
  
  @ApiProperty({ description: 'Soft delete', example: false })
  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);