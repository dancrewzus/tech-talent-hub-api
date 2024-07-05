import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'

import { FunctionalitiesModule } from './functionalities/functionalities.module'
import { JobsModule } from './functionalities/jobs/jobs.module'
import { JoiValidationSchema } from './config/joi.validation'
import { DatabaseModule } from './config/database.module'
import { CommonModule } from './common/common.module'
import configurationFile from './config/env.config'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ configurationFile ],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    JobsModule,
    AuthModule,
    CommonModule,
    FunctionalitiesModule,
  ],
})
export class MainModule {}
