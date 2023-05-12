import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ExercisesModule } from 'src/app/exercises/exercises.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers  : [SeedService],
  imports    : [
    ExercisesModule,
    CommonModule
  ]
})
export class SeedModule {}
