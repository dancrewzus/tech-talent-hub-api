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

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { Image } from 'src/functionalities/images/entities/image.entity';
import { User } from 'src/functionalities/users/entities/user.entity';

@Schema()
export class Movement extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @ApiProperty({ type: String, description: 'Contract ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Contract', required: false })
  contract: Contract;
  
  @ApiProperty({ type: Number, description: 'Movement amount', example: 132 })
  @Prop({ type: Number, required: true })
  amount: number;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: false, default: null })
  paymentPicture: Image;
  
  @ApiProperty({ example: 'in', description: 'Movement type' })
  @Prop({ type: String, required: true, enum: [ 'in', 'out', 'final' ]  })
  type: string;
  
  @ApiProperty({ example: 'Payment of contract #', description: 'Movement description.' })
  @Prop({ type: String, required: true })
  description: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY'), description: 'Movement date.' })
  @Prop({ type: String, required: true })
  movementDate: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
}

export const MovementSchema = SchemaFactory.createForClass( Movement )