import { Module } from '@nestjs/common'

import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { SeedModule } from './seed/seed.module'
import { ContractsModule } from './contracts/contracts.module'
import { PaymentsModule } from './payments/payments/payments.module';

@Module({
  imports: [
    RolesModule,
    UsersModule,
    ContractsModule,
    SeedModule,
    PaymentsModule,
  ],
  exports: [ ],
})
export class FunctionalitiesModule {}
