import { Module } from '@nestjs/common'

import { ExercisesModule } from 'src/app/exercises/exercises.module'
import { WorkoutsModule } from 'src/app/workouts/workouts.module'
import { CommonModule } from 'src/common/common.module'
import { SeedController } from './seed.controller'
import { SeedService } from './seed.service'

@Module({
  controllers: [SeedController],
  providers  : [SeedService],
  imports    : [
    ExercisesModule,
    WorkoutsModule,
    CommonModule
  ]
})
export class SeedModule {}
