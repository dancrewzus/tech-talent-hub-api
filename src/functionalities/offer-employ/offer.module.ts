import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { User, UserSchema } from '../users/entities/user.entity'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { Offer, OfferSchema } from './entities/offer.entity'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from '../users/users.module'
import { CommonModule } from 'src/common/common.module'

@Module({
    controllers: [OfferController],
    providers: [OfferService],
    imports: [
        AuthModule,
        UsersModule,
        CommonModule,
        ConfigModule,
        MongooseModule.forFeature(
            [
                { name: Offer.name, schema: OfferSchema },
                { name: User.name, schema: UserSchema },
                { name: Track.name, schema: TrackSchema },
            ],
            'default'
        ),
    ],
    exports: [OfferService],
})
export class OfferModule {}
