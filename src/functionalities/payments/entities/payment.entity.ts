import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { TimeHandler } from 'src/common/utils/timeHandler.util';
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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: false, default: null })
  paymentPicture: Image;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Payment date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  paymentDate: string;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Creation date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  createdAt?: string;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Updated date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  updatedAt?: string;
}

export const PaymentSchema = SchemaFactory.createForClass( Payment )