import { Module } from '@nestjs/common'

import { ContractsModule } from './contracts/contracts.module'
import { MovementsModule } from './movements/movements.module'
import { ModalitiesModule } from './modality/modality.module'
import { PaymentsModule } from './payments/payments.module'
import { HolidaysModule } from './holidays/holidays.module'
import { ImagesModule } from './images/images.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { SeedModule } from './seed/seed.module'

@Module({
  imports: [
    SeedModule,
    RolesModule,
    UsersModule,
    ContractsModule,
    PaymentsModule,
    MovementsModule,
    ImagesModule,
    HolidaysModule,
    ModalitiesModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
