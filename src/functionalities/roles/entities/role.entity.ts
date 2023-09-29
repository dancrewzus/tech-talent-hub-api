import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Sao_Paulo')

import { User } from '../../users/entities/user.entity';

@Schema()
export class Role extends Document {
  // MAIN DATA
  
  @ApiProperty({ example: 'Administrator', description: 'Role name', uniqueItems: true })
  @Prop({ type: String, required: true, unique: true })
  name: string;
  
  @ApiProperty({ example: false, description: 'It\'s used as default.' })
  @Prop({ type: Boolean, default: false })
  primary: boolean;
  
  @ApiProperty({ example: true, description: 'Is active?.' })
  @Prop({ type: Boolean, default: true })
  status: boolean;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
  
  // RELATION DATA
 
  @ApiProperty({ description: 'List of users that are related to this role.', type: [String] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], select: false })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass( Role )
