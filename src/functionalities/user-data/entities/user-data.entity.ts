import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as dayjs from 'dayjs'

import { User } from '../../users/entities/user.entity';

@Schema()
export class UserData extends Document {

  @Prop({ type: String, required: true, index: true })
  firstName: string;

  @Prop({ type: String, required: false, default: '', index: true })
  secondName?: string;

  @Prop({ type: String, required: true, index: true })
  paternalSurname: string;

  @Prop({ type: String, required: false, default: '', index: true })
  maternalSurname: string;

  @Prop({ type: String, required: false, default: '01/01/1900' })
  birthDate: string;

  @Prop({ type: String, required: false, default: '' })
  profilePicture: string;
  
  @Prop({ type: String, required: true })
  residenceAddress: string;
  
  @Prop({ type: String, required: true })
  billingAddress: string;
  
  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  createdAt?: string;
  
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  updatedAt?: string;
}

export const UserDataSchema = SchemaFactory.createForClass( UserData )
