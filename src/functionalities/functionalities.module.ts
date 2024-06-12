import { Module } from '@nestjs/common'

import { ImagesModule } from './images/images.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { SeedModule } from './seed/seed.module'
import { NotificationsModule } from './notifications/notifications.module';
import { TracksModule } from './tracks/tracks.module'
import { CategoriesModule } from './categories/categories.module'
import { OffersModule } from './offers/offers.module'


@Module({
  imports: [
    TracksModule,
    SeedModule,
    RolesModule,
    UsersModule,
    ImagesModule,
    NotificationsModule,
    CategoriesModule,
    OffersModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
