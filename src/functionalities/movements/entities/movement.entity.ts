import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs'

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { User } from 'src/functionalities/users/entities/user.entity';

@Schema()
export class Movement extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @ApiProperty({ type: String, description: 'Contract ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: false })
  contract: Contract;
  
  @ApiProperty({ type: Number, description: 'Movement amount', example: 132 })
  @Prop({ type: Number, required: true })
  amount: number;
  
  @ApiProperty({ example: 'https://...', description: 'Image URL.' })
  @Prop({ type: String, default: '' })
  imageUrl?: string;
  
  @ApiProperty({ example: 'in', description: 'Movement type' })
  @Prop({ type: String, required: true, enum: [ 'in', 'out', 'final' ]  })
  type: string;
  
  @ApiProperty({ example: 'Payment of contract #', description: 'Movement description.' })
  @Prop({ type: String, required: true })
  description: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY'), description: 'Movement date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY') })
  movementDate: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  updatedAt?: string;
}

export const MovementSchema = SchemaFactory.createForClass( Movement )