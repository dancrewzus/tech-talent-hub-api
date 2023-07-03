import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'

import { FunctionalitiesModule } from './functionalities/functionalities.module'
import { JoiValidationSchema } from './config/joi.validation'
import { CommonModule } from './common/common.module'
import configurationFile from './config/env.config'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurationFile],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.CONNECTION_STRING,
      }),
    }),
    AuthModule,
    CommonModule,
    FunctionalitiesModule,
  ],
})
export class MainModule {}
