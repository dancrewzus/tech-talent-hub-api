import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { GeolocationSchema, Geolocation } from '../movements/entities/location.entity';
import { Image, ImageSchema } from '../images/entities/image.entity';
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
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Geolocation.name,
        schema: GeolocationSchema
      },
      {
        name: Image.name,
        schema: ImageSchema
      },
    ], 'default')
  ], 
  exports: [ UsersService ]
})
export class UsersModule {}
