import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs'

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { User } from 'src/functionalities/users/entities/user.entity';

@Schema()
export class Payment extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
  
  @ApiProperty({ type: String, description: 'Client ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  client: User;
  
  @ApiProperty({ type: String, description: 'Contract ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true })
  contract: Contract;
  
  @ApiProperty({ type: Number, description: 'Payment amount', example: 132 })
  @Prop({ type: Number, required: true })
  amount: number;
  
  @ApiProperty({ type: Number, description: 'Payment number', example: 3 })
  @Prop({ type: Number, required: true })
  paymentNumber: number;
  
  @ApiProperty({ example: 'https://...', description: 'Image URL.' })
  @Prop({ type: String, default: '' })
  imageUrl?: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Payment date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  paymentDate: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  updatedAt?: string;
}

export const PaymentSchema = SchemaFactory.createForClass( Payment )