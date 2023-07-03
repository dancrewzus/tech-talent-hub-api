import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

import { UserData, UserDataSchema } from '../user-data/entities/user-data.entity'
import { Role, RoleSchema } from '../roles/entities/role.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { CommonModule } from 'src/common/common.module'
import { AuthModule } from 'src/auth/auth.module'

import { SeedController } from './seed.controller'
import { SeedService } from './seed.service'
import { SeedData } from './data/data.seed'

@Module({
  controllers: [ SeedController ],
  providers: [ SeedService, SeedData ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: UserData.name,
        schema: UserDataSchema
      },
    ])
  ],
})
export class SeedModule {}
