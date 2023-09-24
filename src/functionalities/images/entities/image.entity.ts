import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { TimeHandler } from 'src/common/utils/timeHandler.util';
import { User } from '../../users/entities/user.entity';

@Schema()
export class Image extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @ApiProperty({ description: 'Image url', example: 'http://...' })
  @Prop({ type: String, required: true })
  imageUrl: string;
  
  @ApiProperty({ description: 'Image public ID', example: 'Clients/jhgshjgfjhgdhj' })
  @Prop({ type: String, required: true })
  publicId: string;
  
  @ApiProperty({ description: 'Image folder', example: 'Clients' })
  @Prop({ type: String, required: true })
  folder: string;
  
  @ApiProperty({ description: 'Image format', example: 'jpg' })
  @Prop({ type: String, required: true })
  format: string;
  
  @ApiProperty({ description: 'Image bytes', example: '1024' })
  @Prop({ type: Number, required: true })
  bytes: number;
  
  @ApiProperty({ description: 'Image width', example: '576' })
  @Prop({ type: Number, required: true })
  width: number;
  
  @ApiProperty({ description: 'Image height', example: '1024' })
  @Prop({ type: Number, required: true })
  height: number;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Creation date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  createdAt?: string;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Updated date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  updatedAt?: string;
}

export const ImageSchema = SchemaFactory.createForClass( Image )

