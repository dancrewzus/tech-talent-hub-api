import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs'

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
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  updatedAt?: string;
  
  // RELATION DATA
 
  @ApiProperty({ description: 'List of users that are related to this role.', type: [String] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], select: false })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass( Role )
