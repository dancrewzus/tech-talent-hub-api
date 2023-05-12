import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateExerciseDto } from 'src/app/exercises/dto/create-exercise.dto'
import { Exercise } from '../app/exercises/entities/exercise.entity'

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<Exercise>,
  ) {}

  public executeSeed = async () => {
    await this.exerciseModel.deleteMany()
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
    await this.exerciseModel.insertMany( exercisesToInsert )
    return 'Seed completed!'
  }
}
