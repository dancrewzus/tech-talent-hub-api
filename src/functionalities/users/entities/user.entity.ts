import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs'

import { UserData } from 'src/functionalities/user-data/entities/user-data.entity';
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
  
  @Prop({ type: String, required: true, unique: true, index: true })
  cpf: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, required: false, default: '' })
  recoveryCode: string;
  
  @Prop({ type: Boolean, required: false, default: true })
  isActive: boolean;
  
  @Prop({ type: Boolean, required: false, default: false })
  isLogged: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role: Role;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'UserData', required: false })
  data?: UserData;

  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  createdAt?: string;
  
  @Prop({ type: String, default: dayjs().format('DD/MM/YYYY HH:mm:ss') })
  updatedAt?: string;
}

export const UserSchema = SchemaFactory.createForClass( User )
