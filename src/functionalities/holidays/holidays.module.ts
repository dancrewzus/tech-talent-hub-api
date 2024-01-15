import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Holiday, HolidaySchema } from './entities/holiday.entity';
import { HolidaysController } from './holidays.controller';
import { CommonModule } from 'src/common/common.module';
import { HolidaysService } from './holidays.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ HolidaysController ],
  providers: [ HolidaysService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Holiday.name,
        schema: HolidaySchema
      },
    ], 'default')
  ]
})
export class HolidaysModule {}
