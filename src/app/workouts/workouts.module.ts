import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Workout, WorkoutSchema } from './entities/workout.entity';
import { WorkoutsController } from './workouts.controller';
import { CommonModule } from 'src/common/common.module';
import { WorkoutsService } from './workouts.service';

@Module({
  controllers: [ WorkoutsController ],
  providers: [ WorkoutsService ],
  imports: [
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Workout.name,
        schema: WorkoutSchema
      }
    ])
  ],
  exports: [ 
    MongooseModule, 
    WorkoutsService
  ]
})
export class WorkoutsModule {}
