import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Contract, ContractSchema } from 'src/functionalities/contracts/entities/contracts.entity';
import { User, UserSchema } from 'src/functionalities/users/entities/user.entity';
import { Payment, PaymentSchema } from '../payments/entities/payment.entity';
import { GeolocationSchema, Geolocation } from './entities/location.entity';
import { Movement, MovementSchema } from './entities/movement.entity';
import { Image, ImageSchema } from '../images/entities/image.entity';
import { ContractsService } from '../contracts/contracts.service';
import { Role, RoleSchema } from '../roles/entities/role.entity';
import { PaymentsService } from '../payments/payments.service';
import { MovementsController } from './movements.controller';
import { CommonModule } from 'src/common/common.module';
import { MovementsService } from './movements.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ MovementsController ],
  providers: [ MovementsService, ContractsService, PaymentsService ],
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
        name: Geolocation.name,
        schema: GeolocationSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Role.name,
        schema: RoleSchema
      },
      {
        name: Contract.name,
        schema: ContractSchema
      },
      {
        name: Image.name,
        schema: ImageSchema
      },
      {
        name: Payment.name,
        schema: PaymentSchema
      },
    ], 'default')
  ]
})
export class MovementsModule {}
