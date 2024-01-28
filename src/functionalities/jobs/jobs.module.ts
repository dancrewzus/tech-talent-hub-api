import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Geolocation, GeolocationSchema } from '../movements/entities/location.entity';
import { Contract, ContractSchema } from '../contracts/entities/contracts.entity';
import { Movement, MovementSchema } from '../movements/entities/movement.entity';
import { Modality, ModalitySchema } from '../modality/entities/modality.entity';
import { Holiday, HolidaySchema } from '../holidays/entities/holiday.entity';
import { Payment, PaymentSchema } from '../payments/entities/payment.entity';
import { Image, ImageSchema } from '../images/entities/image.entity';
import { Role, RoleSchema } from '../roles/entities/role.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonModule } from 'src/common/common.module';

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
  {
    name: Holiday.name,
    schema: HolidaySchema
  },
  {
    name: Modality.name,
    schema: ModalitySchema
  },
]

@Module({
  providers: [JobsService],
  imports: [
    CommonModule,
    MongooseModule.forFeature(MODELS, 'test'),
    MongooseModule.forFeature(MODELS, 'backup'),
    MongooseModule.forFeature(MODELS, 'production'),
  ],
})
export class JobsModule {}