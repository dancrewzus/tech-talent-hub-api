import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Exercise, ExerciseSchema } from './entities/exercise.entity';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

@Module({
  controllers: [ ExercisesController ],
  providers: [ ExercisesService ],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Exercise.name,
        schema: ExerciseSchema
      }
    ])
  ],
  exports: [ MongooseModule ]
})
export class ExercisesModule {}
