import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { User, UserSchema } from 'src/functionalities/users/entities/user.entity';
import { Movement, MovementSchema } from './entities/movement.entity';
import { Contract, ContractSchema } from 'src/functionalities/contracts/entities/contracts.entity';

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
    ])
  ]
})
export class MovementsModule {}
