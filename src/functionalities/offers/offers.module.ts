import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Offer, OfferSchema } from './entities/offer.entity'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { CategoriesController } from './offers.controller'
import { CommonModule } from '../../common/common.module'
import { OffersService } from './offers.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [ CategoriesController ],
  providers: [ OffersService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema
      },
      {
        name: Offer.name,
        schema: OfferSchema
      },
    ], 'default')
  ], 
  exports: [ OffersService ]
})
export class OffersModule {}
