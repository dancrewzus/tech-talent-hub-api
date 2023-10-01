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

import { Image } from 'src/functionalities/images/entities/image.entity';
import { Role } from 'src/functionalities/roles/entities/role.entity';

@Schema()
export class User extends Document {

  @Prop({ type: String, required: false })
  @ApiProperty({
    example: 'adumbledore@howarts.magic',
    description: 'User email.',
    uniqueItems: true
  })
  email?: string;
  
  @Prop({ type: String, required: true, unique: true })
  cpf: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false, default: '' })
  recoveryCode: string;
  
  @Prop({ type: Boolean, required: false, default: true })
  isActive: boolean;
  
  @Prop({ type: Boolean, required: false, default: false })
  isLogged: boolean;

  /**
   * USER DATA
   */

  @Prop({ type: String, required: true })
  gender: string;
  
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: false, default: '' })
  secondName?: string;

  @Prop({ type: String, required: true })
  paternalSurname: string;

  @Prop({ type: String, required: false, default: '' })
  maternalSurname: string;

  @Prop({ type: String, required: false, default: '01/01/1900' })
  birthDate: string;
  
  @Prop({ type: String, required: true })
  residenceAddress: string;
  
  @Prop({ type: String, required: true })
  billingAddress: string;
  
  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: false, default: null })
  profilePicture: Image;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: false, default: null })
  addressPicture: Image;

  // END USER DATA

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: Role;

  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  createdBy: User;

  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
}

export const UserSchema = SchemaFactory.createForClass( User )
