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
export class Payment extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
  
  @ApiProperty({ type: String, description: 'Client ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  client: User;
  
  @ApiProperty({ type: String, description: 'Contract ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Contract', required: true })
  contract: Contract;
  
  @ApiProperty({ type: Number, description: 'Payment amount', example: 132 })
  @Prop({ type: Number, required: true })
  amount: number;
  
  @ApiProperty({ type: Number, description: 'Payment number', example: 3 })
  @Prop({ type: Number, required: true })
  paymentNumber: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true })
  paymentPicture: Image;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Payment date.' })
  @Prop({ type: String, required: true })
  paymentDate: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
}

export const PaymentSchema = SchemaFactory.createForClass( Payment )