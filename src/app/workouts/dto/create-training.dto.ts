import { IsObject, IsInt } from 'class-validator'

export class CreateTrainingDto {
  
  @IsObject()
  exercise: Object
  
  @IsInt()
  sets: Number
  
  @IsInt()
  reps: Number
  
  @IsInt()
  weight: Number
}
