import { Module } from '@nestjs/common'

import { SeedModule } from './seed/seed.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { ContractsModule } from './contracts/contracts.module'
import { PaymentsModule } from './payments/payments.module';
import { MovementsModule } from './movements/movements.module';
import { ImagesModule } from './images/images.module'

@Module({
  imports: [
    SeedModule,
    RolesModule,
    UsersModule,
    ContractsModule,
    PaymentsModule,
    MovementsModule,
    ImagesModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
