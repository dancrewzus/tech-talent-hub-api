import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { Contract, ContractSchema } from './entities/contracts.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { CommonModule } from 'src/common/common.module'

import { ContractsController } from './contracts.controller'
import { ContractsService } from './contracts.service'
import { AuthModule } from 'src/auth/auth.module'
import { Movement, MovementSchema } from '../movements/entities/movement.entity'

@Module({
  controllers: [ ContractsController ],
  providers: [ ContractsService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
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
    ])
  ]
})
export class ContractsModule {}
