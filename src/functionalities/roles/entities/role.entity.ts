import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../users/entities/user.entity';

@Schema()
export class Role extends Document {

  @ApiProperty({ example: 'Administrator', description: 'Role name', uniqueItems: true })
  @Prop({ type: String, required: true, unique: true })
  name: string;
  
  @ApiProperty({ example: false, description: 'It\'s used as default.' })
  @Prop({ type: Boolean, default: false })
  primary: boolean;
  
  @ApiProperty({ example: true, description: 'Is active?.' })
  @Prop({ type: Boolean, default: true })
  status: boolean;
  
  @ApiProperty({ example: '01/01/1900 00:00:00', description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: '01/01/1900 00:00:00', description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
 
  @ApiProperty({ description: 'List of users that are related to this role.', type: [String] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], select: false })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass( Role )
