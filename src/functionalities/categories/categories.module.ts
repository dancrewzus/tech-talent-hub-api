import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from './entities/category.entity'
import { Track, TrackSchema } from '../tracks/entities/track.entity'
import { CategoriesController } from './categories.controller'
import { CommonModule } from '../../common/common.module'
import { CategoriesService } from './categories.service'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  controllers: [ CategoriesController ],
  providers: [ CategoriesService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Track.name,
        schema: TrackSchema
      },
      {
        name: Category.name,
        schema: CategorySchema
      },
    ], 'default')
  ], 
  exports: [ CategoriesService ]
})
export class CategoriesModule {}
