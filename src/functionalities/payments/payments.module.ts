import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Contract, ContractSchema } from 'src/functionalities/contracts/entities/contracts.entity';
import { GeolocationSchema, Geolocation } from '../movements/entities/location.entity';
import { User, UserSchema } from 'src/functionalities/users/entities/user.entity';
import { Movement, MovementSchema } from '../movements/entities/movement.entity';
import { Image, ImageSchema } from '../images/entities/image.entity';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { CommonModule } from 'src/common/common.module';
import { PaymentsService } from './payments.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ PaymentsController ],
  providers: [ PaymentsService ],
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
        name: Payment.name,
        schema: PaymentSchema
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
        name: Image.name,
        schema: ImageSchema
      },
    ], 'default')
  ]
})
export class PaymentsModule {}
