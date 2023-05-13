import { Injectable } from '@nestjs/common'

import { CreateExerciseDto } from '../app/exercises/dto/create-exercise.dto'
import { CreateWorkoutDto } from '../app/workouts/dto/create-workout.dto'
import { ExercisesService } from 'src/app/exercises/exercises.service'
import { WorkoutsService } from 'src/app/workouts/workouts.service'

@Injectable()
export class SeedService {

  constructor(
    private readonly exerciseService: ExercisesService,
    private readonly workoutService: WorkoutsService,
  ) {}

  public executeSeed = async () => {
    // STEP 1: Insert exercises
    await this.exerciseService.deleteAll()
    const exercisesToInsert: CreateExerciseDto[] = [
      {
        name: 'Squat Clean',
        description: 'A weightlifting exercise that combines a squat and a clean.',
        category: 'weightlifting',
      },
      {
        name: 'Power Clean',
        description: 'A weightlifting exercise that focuses on power and speed.',
        category: 'weightlifting',
      },
      {
        name: 'Clean and Jerk',
        description: 'A two-part weightlifting exercise involving a clean and a jerk.',
        category: 'weightlifting',
      },
      {
        name: 'Power Snatch',
        description: 'A weightlifting exercise that involves a wide grip and a quick, powerful movement.',
        category: 'weightlifting',
      },
      {
        name: 'Squat Snatch',
        description: 'A weightlifting exercise that combines a squat and a snatch.',
        category: 'weightlifting',
      },
    ]
    await this.exerciseService.insertMany( exercisesToInsert )
    console.log("🚀 ~ Exercises seeded!")
    
    // STEP 2: Insert workouts
    const exercises = await this.exerciseService.findAll({ limit: 100, offset: 0 });
    await this.workoutService.deleteAll()
    const workoutsToInsert: CreateWorkoutDto[] = []
    const user = 'UserTest'
    const liftData = {
      maxWeightClean: 140,
      maxWeightSnatch: 100,
      maxRepsClean: 12,
      maxRepsSnatch: 10,
      maxSets: 4,
    }
    // Simple for for create all random trainings
    for (let i = 0; i < 100; i++) {
      const exercise = exercises[Math.floor(Math.random() * exercises.length)]
      const workout: CreateWorkoutDto = {
        user,
        comments: 'Test workout',
        exercises: [
          {
            exercise,
            sets: Math.floor(Math.random() * liftData.maxSets) || 1,
            reps: Math.floor(Math.random() * (exercise.name.includes('clean') ? liftData.maxRepsClean : liftData.maxRepsSnatch)) || 1,
            weight: Math.floor(Math.random() * (exercise.name.includes('clean') ? liftData.maxWeightClean : liftData.maxWeightSnatch)) || 1,
          },
        ],
      }
      workoutsToInsert.push(workout)
    }
    await this.workoutService.insertMany( workoutsToInsert )
    console.log("🚀 ~ Workouts seeded!")

    return 'Seed completed!'
  }
}
