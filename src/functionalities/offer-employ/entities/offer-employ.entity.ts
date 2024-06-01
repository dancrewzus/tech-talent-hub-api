import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

import { User } from '../../users/entities/user.entity'

@Schema()
export class Offer extends Document {
    @Prop({ type: String, required: true })
    title: string

    @Prop({ type: String, required: true })
    position: string

    @Prop({ type: Number, required: true })
    yearsOfExperience: number

    @Prop({ type: String, required: true })
    contract: string

    @Prop({ type: String, required: true })
    keywords: string

    @Prop({ type: Number, required: true })
    salary: number

    @Prop({ type: String, required: true })
    hiringDate: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    createdBy: User

    @Prop({ type: Boolean, default: true })
    status: boolean

    @Prop({ type: String, required: true })
    createdAt?: string

    @Prop({ type: String, required: true })
    updatedAt?: string

    @Prop({ type: String, default: null, nullable: true })
    deletedAt?: string

    @Prop({ type: Boolean, default: false })
    deleted: boolean

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
        select: false,
    })
    users: User[]
}

export const OfferSchema = SchemaFactory.createForClass(Offer)
