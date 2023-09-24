import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { TimeHandler } from 'src/common/utils/timeHandler.util';
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
  
  @ApiProperty({ example: TimeHandler.getNow('simple'), description: 'Movement date.' })
  @Prop({ type: String, default: TimeHandler.getNow('simple') })
  movementDate: string;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Creation date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  createdAt?: string;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Updated date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  updatedAt?: string;
}

export const MovementSchema = SchemaFactory.createForClass( Movement )