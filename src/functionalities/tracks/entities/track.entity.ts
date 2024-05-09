import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import * as mongoosePaginate from 'mongoose-paginate-v2'

import { User } from '../../users/entities/user.entity'

@Schema()
export class Track extends Document {
  
  @ApiProperty({ example: '192.168.0.100', description: 'Request IP' })
  @Prop({ type: String, required: true })
  ip: string
  
  @ApiProperty({ example: 'User "Harry Potter" created', description: 'Event description' })
  @Prop({ type: String, required: true })
  description: string
  
  @ApiProperty({ example: 'users', description: 'Module trigger' })
  @Prop({ type: String, required: true })
  module: string
  
  @ApiProperty({ example: '01/01/1900 00:00:00', description: 'Creation date.' })
  @Prop({ type: String, required: true })
  createdAt: string
  
  @ApiProperty({ example: '654df2465ed4f4654edf', description: 'User that trigger track with API action' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User
}

export const TrackSchema = SchemaFactory.createForClass( Track )
TrackSchema.plugin(mongoosePaginate)