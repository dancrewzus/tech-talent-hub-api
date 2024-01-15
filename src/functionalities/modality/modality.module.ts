import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Modality, ModalitySchema } from './entities/modality.entity';
import { ModalitiesController } from './modality.controller';
import { CommonModule } from 'src/common/common.module';
import { ModalitiesService } from './modality.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ ModalitiesController ],
  providers: [ ModalitiesService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Modality.name,
        schema: ModalitySchema
      },
    ], 'default')
  ]
})
export class ModalitiesModule {}
