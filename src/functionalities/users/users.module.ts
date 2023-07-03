import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserDataModule } from '../user-data/user-data.module';
import { User, UserSchema } from './entities/user.entity';
import { CommonModule } from '../../common/common.module';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';

@Module({
  controllers: [ UsersController ],
  providers: [ UsersService ],
  imports: [
    AuthModule,
    RolesModule,
    ConfigModule,
    CommonModule,
    UserDataModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
    ])
  ], 
  exports: [ UsersService ]
})
export class UsersModule {}
