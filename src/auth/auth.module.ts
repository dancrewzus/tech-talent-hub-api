import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose/dist'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { Track, TrackSchema } from 'src/functionalities/tracks/entities/track.entity'
import { User, UserSchema } from 'src/functionalities/users/entities/user.entity'
import { Role, RoleSchema } from 'src/functionalities/roles/entities/role.entity'
import { CommonModule } from 'src/common/common.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JWT_CONFIG } from 'src/config/jwt.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy ],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Role.name,
        schema: RoleSchema
      },
    ], 'default'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JWT_CONFIG)
  ],
  exports: [ JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
