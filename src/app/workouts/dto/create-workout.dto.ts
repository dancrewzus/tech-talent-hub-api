import { IsArray, IsDate, IsString, MinLength } from 'class-validator'

import { CreateTrainingDto } from './create-training.dto'

export class CreateWorkoutDto {
  
  @IsString()
  @MinLength(1)
  user: string
  
  @IsString()
  @MinLength(1)
  comments: string
  
  @IsArray()
  exercises: CreateTrainingDto[]
  
  @IsDate()
  createdAt?: string
}
