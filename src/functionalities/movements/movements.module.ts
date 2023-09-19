import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Contract, ContractSchema } from 'src/functionalities/contracts/entities/contracts.entity';
import { User, UserSchema } from 'src/functionalities/users/entities/user.entity';
import { Movement, MovementSchema } from './entities/movement.entity';
import { Image, ImageSchema } from '../images/entities/image.entity';
import { MovementsController } from './movements.controller';
import { CommonModule } from 'src/common/common.module';
import { MovementsService } from './movements.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ MovementsController ],
  providers: [ MovementsService ],
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
    ])
  ]
})
export class MovementsModule {}
