import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Image, ImageSchema } from '../images/entities/image.entity'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { Role, RoleSchema } from '../roles/entities/role.entity'
import { User, UserSchema } from './entities/user.entity'
import { CommonModule } from '../../common/common.module'
import { UsersController } from './users.controller'
import { RolesModule } from '../roles/roles.module'
import { AuthModule } from 'src/auth/auth.module'
import { UsersService } from './users.service'

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
        name: Track.name,
        schema: TrackSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: Image.name,
        schema: ImageSchema
      },
      {
        name: Role.name,
        schema: RoleSchema
      },
    ], 'default')
  ], 
  exports: [ UsersService ]
})
export class UsersModule {}
