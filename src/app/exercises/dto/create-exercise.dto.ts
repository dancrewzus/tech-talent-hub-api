import { IsDate, IsString, MinLength } from 'class-validator'

export class CreateExerciseDto {
  
  @IsString()
  @MinLength(1)
  name: string
  
  @IsString()
  @MinLength(1)
  description: string
  
  @IsString()
  @MinLength(1)
  category: string
  
  @IsDate()
  createdAt: string
}
