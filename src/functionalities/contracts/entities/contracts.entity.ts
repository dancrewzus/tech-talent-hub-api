import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { TimeHandler } from 'src/common/utils/timeHandler.util';
import { User } from '../../users/entities/user.entity';
import { Payment } from 'src/functionalities/payments/entities/payment.entity';
import { Movement } from 'src/functionalities/movements/entities/movement.entity';

@Schema()
export class Contract extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
  
  @ApiProperty({ type: String, description: 'Client ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  client: User;

  @ApiProperty({ type: String, description: 'Payment method', example: 'daily' })
  @Prop({ type: String, required: true, enum: [ 'daily', 'weekly' ] })
  modality: string;

  @ApiProperty({ description: 'Modality options', example: '10-11 (Where => 10% 11 days)' })
  @Prop({ type: String, default: '' })
  modalityOptions: string;

  @ApiProperty({ type: Number, description: 'Loan amount', example: 120 })
  @Prop({ type: Number, required: true })
  loanAmount: number;

  @ApiProperty({ type: Number, description: 'Loan percent', example: 10 })
  @Prop({ type: Number, required: true })
  percent: number;

  @ApiProperty({ type: Number, description: 'Payments quantity', example: 20 })
  @Prop({ type: Number, required: true })
  payments: number;
  
  @ApiProperty({ type: Number, description: 'Payment amount', example: 6.6 })
  @Prop({ type: Number, required: true })
  paymentAmount: number;
  
  @ApiProperty({ type: Number, description: 'Total amount', example: 132 })
  @Prop({ type: Number, required: true })
  totalAmount: number;

  @ApiProperty({ type: String, description: 'Non-working days', example: 'LuMaMiJuViSaDo' })
  @Prop({ type: String, required: false, default: 'Do' })
  nonWorkingDays: string;

  @ApiProperty({ type: Boolean, description: 'Is active?', example: true })
  @Prop({ type: Boolean, default: true })
  status: boolean;

  @ApiProperty({ example: TimeHandler.getNow('simple'), description: 'Last contract date.' })
  @Prop({ type: String, default: TimeHandler.getNow('simple') })
  lastContractDate?: string;

  @ApiProperty({ description: 'List of payments.', type: [String] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }], select: false })
  paymentList: Payment[];
  
  @ApiProperty({ description: 'List of movements.', type: [String] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movement' }], select: false })
  movementList: Movement[];
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Creation date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  createdAt?: string;
  
  @ApiProperty({ example: TimeHandler.getNow(), description: 'Updated date.' })
  @Prop({ type: String, default: TimeHandler.getNow() })
  updatedAt?: string;
}

export const ContractSchema = SchemaFactory.createForClass( Contract )

