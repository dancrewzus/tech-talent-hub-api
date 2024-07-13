import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from '../categories/entities/category.entity';
import { Offer, OfferSchema } from './entities/offer.entity'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { OffersController } from './offers.controller'
import { CommonModule } from '../../common/common.module'
import { OffersService } from './offers.service'
import { AuthModule } from 'src/auth/auth.module'
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  controllers: [ OffersController ],
  providers: [ OffersService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Track.name,
        schema: TrackSchema
      },
      {
        name: Offer.name,
        schema: OfferSchema
      },
      {
        name: Category.name,
        schema: CategorySchema
      },
    ], 'default')
  ], 
  exports: [ OffersService ]
})
export class OffersModule {}
