import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { Movement, MovementSchema } from '../movements/entities/movement.entity'
import { Payment, PaymentSchema } from '../payments/entities/payment.entity'
import { Contract, ContractSchema } from './entities/contracts.entity'
import { Image, ImageSchema } from '../images/entities/image.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { ContractsController } from './contracts.controller'
import { CommonModule } from 'src/common/common.module'
import { ContractsService } from './contracts.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [ ContractsController ],
  providers: [ ContractsService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema
      },
      {
        name: Movement.name,
        schema: MovementSchema
      },
      {
        name: Contract.name,
        schema: ContractSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Image.name,
        schema: ImageSchema
      },
    ], 'default')
  ]
})
export class ContractsModule {}
