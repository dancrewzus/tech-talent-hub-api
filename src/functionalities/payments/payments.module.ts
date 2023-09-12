import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { User, UserSchema } from 'src/functionalities/users/entities/user.entity';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { Contract, ContractSchema } from 'src/functionalities/contracts/entities/contracts.entity';
import { Movement, MovementSchema } from '../movements/entities/movement.entity';

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
    ])
  ]
})
export class PaymentsModule {}
