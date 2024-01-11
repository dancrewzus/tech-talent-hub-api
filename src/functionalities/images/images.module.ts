import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { Image, ImageSchema } from './entities/image.entity'
import { User, UserSchema } from '../users/entities/user.entity'
import { CommonModule } from 'src/common/common.module'

import { ImagesController } from './images.controller'
import { AuthModule } from 'src/auth/auth.module'
import { ImagesService } from './images.service'

@Module({
  controllers: [ ImagesController ],
  providers: [ ImagesService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Image.name,
        schema: ImageSchema
      },
      {
        name: User.name,
        schema: UserSchema
      },
    ], 'default')
  ]
})
export class ImagesModule {}
