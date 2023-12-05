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

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { Movement } from 'src/functionalities/movements/entities/movement.entity';
import { User } from 'src/functionalities/users/entities/user.entity';

@Schema()
export class Geolocation extends Document {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
  
  @ApiProperty({ type: String, description: 'Client ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  client: User;
  
  @ApiProperty({ type: String, description: 'Contract ID', example: '6472d32b20f00d485b965c1e' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Contract', required: true })
  contract: Contract;
  
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movement', required: true })
  movement: Movement;

  @ApiProperty({ example: -1.123456789, description: 'Client location latitude.' })
  @Prop({ type: Number, required: true })
  latitude: number;

  @ApiProperty({ example: 1.123456789, description: 'Client location longitude.' })
  @Prop({ type: Number, required: true })
  longitude: number;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt?: string;
  
  @ApiProperty({ example: dayjs.tz().format('DD/MM/YYYY HH:mm:ss'), description: 'Updated date.' })
  @Prop({ type: String, required: true })
  updatedAt?: string;
}

export const GeolocationSchema = SchemaFactory.createForClass( Geolocation )