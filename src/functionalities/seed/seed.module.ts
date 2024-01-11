import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

import { Geolocation, GeolocationSchema } from '../movements/entities/location.entity'
import { Contract, ContractSchema } from '../contracts/entities/contracts.entity'
import { Movement, MovementSchema } from '../movements/entities/movement.entity'
import { Payment, PaymentSchema } from '../payments/entities/payment.entity'
import { Image, ImageSchema } from '../images/entities/image.entity'
import { Role, RoleSchema } from '../roles/entities/role.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { CommonModule } from 'src/common/common.module'
import { SeedController } from './seed.controller'
import { SeedService } from './seed.service'
import { SeedData } from './data/data.seed'

const MODELS = [
  {
    name: Role.name,
    schema: RoleSchema
  },
  {
    name: User.name,
    schema: UserSchema,
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
  {
    name: Geolocation.name,
    schema: GeolocationSchema
  },
]

@Module({
  controllers: [ SeedController ],
  providers: [ SeedService, SeedData ],
  imports: [
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature(MODELS, 'test'),
    MongooseModule.forFeature(MODELS, 'production'),
  ],
})
export class SeedModule {}
