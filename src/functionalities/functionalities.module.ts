import { Module } from '@nestjs/common'

import { OffersModule } from './offers/offers.module'
import { ImagesModule } from './images/images.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { SeedModule } from './seed/seed.module'
import { NotificationsModule } from './notifications/notifications.module';
import { TracksModule } from './tracks/tracks.module'


@Module({
  imports: [
    OffersModule,
    TracksModule,
    SeedModule,
    RolesModule,
    UsersModule,
    ImagesModule,
    NotificationsModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
