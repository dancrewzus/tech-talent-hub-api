import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

import { Payment, PaymentSchema } from '../payments/entities/payment.entity'
import { Contract, ContractSchema } from '../contracts/entities/contracts.entity'
import { Role, RoleSchema } from '../roles/entities/role.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { CommonModule } from 'src/common/common.module'
import { AuthModule } from 'src/auth/auth.module'

import { SeedController } from './seed.controller'
import { SeedService } from './seed.service'
import { SeedData } from './data/data.seed'
import { Movement, MovementSchema } from '../movements/entities/movement.entity'
import { Image, ImageSchema } from '../images/entities/image.entity'

@Module({
  controllers: [ SeedController ],
  providers: [ SeedService, SeedData ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Contract.name,
        schema: ContractSchema
      },
      {
        name: Payment.name,
        schema: PaymentSchema
      },
      {
        name: Movement.name,
        schema: MovementSchema
      },
      {
        name: Image.name,
        schema: ImageSchema
      },
    ])
  ],
})
export class SeedModule {}
