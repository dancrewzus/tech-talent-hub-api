import { IsEnum, IsObject, IsOptional, IsString, MinLength } from 'class-validator'

import { User } from '../../users/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

export enum genders {
  male = 'male',
  female = 'female',
}
export class CreateUserDataDto {
  
  @ApiProperty({
    example: 'Albus',
    description: 'User name.',
  })
  @IsString() 
  firstName: string
  
  @IsString()
  @IsOptional() 
  secondName?: string
  
  @ApiProperty({
    example: 'Dumbledore',
    description: 'User lastname.',
  })
  @IsString() 
  paternalSurname: string
  
  @IsString()
  @IsOptional()
  maternalSurname?: string
  
  @ApiProperty({
    example: 'Dumbledore',
    description: 'User lastname.',
  })
  @IsString()
  @IsOptional()
  birthDate?: string
  
  @ApiProperty({
    example: 'male',
    description: 'User gender.',
  })
  @IsString()
  @IsEnum(genders)
  gender: string
  
  @ApiProperty({
    example: '',
    description: 'User profile picture.',
  })
  @IsString()
  @IsOptional()
  profilePicture?: string

  @ApiProperty({
    example: 'Privet Drive Nro. 4',
    description: 'User residence address.',
  })
  @IsString()
  @MinLength(2)
  residenceAddress: string

  @ApiProperty({
    example: 'Hogwarts',
    description: 'User billing address.',
  })
  @IsString()
  @MinLength(2)
  billingAddress: string
  
  @ApiProperty({
    example: '123456789',
    description: 'User phone number.',
  })
  @IsString()
  @MinLength(2)
  phoneNumber: string
  
  @IsObject() 
  user: User
}

