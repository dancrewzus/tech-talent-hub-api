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
import { Category } from 'src/functionalities/categories/entities/category.entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';

@Schema()
export class Offer extends Document {
  
  @ApiProperty({ description: 'Offer title', example: 'Frontend Developer' })
  @Prop({ type: String, required: true })
  title: string;
  
  @ApiProperty({ description: 'Offer title slug', example: 'frontend-developer' })
  @Prop({ type: String, required: true })
  slug: string;
  
  @ApiProperty({ description: 'Offer description', example: 'We require a frontend developer with technical skills in...' })
  @Prop({ type: String, required: true })
  description: string;
  
  @ApiProperty({ description: 'Offer position', example: 'Software Engineer' })
  @Prop({ type: String, required: true })
  position: string
  
  @ApiProperty({ description: 'Offer required years of experience', example: 8 })
  @Prop({ type: Number, required: true })
  yearsOfExperience: number
  
  @ApiProperty({ description: 'Array of offer keywords', example: ['frontend','angular','vue','javascript'] })
  @Prop({ type: [ String ], required: true })
  keywords: string[]

  @ApiProperty({ example: '01/01/1900', description: 'Offer max hiring date - Format DD/MM/YYYY.' })
  @Prop({ type: String, required: true })
  hiringDate: string
  
  @ApiProperty({  description: 'Offer type of contract', example: 'Permanent' })
  @Prop({ type: String, required: true })
  typeOfContract: string
  
  @ApiProperty({ description: 'Offer salary min range', example: 3000 })
  @Prop({ type: String, required: true })
  salaryMin: number;
  
  @ApiProperty({ description: 'Offer salary max range', example: 4100 })
  @Prop({ type: String, required: true })
  salaryMax: number;

  @ApiProperty({ description: 'Offer salary currency', example: 'USD' })
  @Prop({ type: String, required: true })
  currency: string;
  
  @ApiProperty({ description: 'Offer country', example: 'Venezuela' })
  @Prop({ type: String, required: true })
  country: string;
  
  @ApiProperty({ description: 'Offer remote option', example: true })
  @Prop({ type: String, required: true })
  remote: boolean;
  
  @ApiProperty({ description: 'Offer category', example: '654s6f54d-fe5d6f465er-evg5h1bn8t' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;
  
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

  @ApiProperty({ description: 'List of users that are applied to this offers.', type: [String] })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], select: false })
  applies: User[];
}

export const OfferSchema = SchemaFactory.createForClass( Offer )
OfferSchema.plugin(mongoosePaginate)
