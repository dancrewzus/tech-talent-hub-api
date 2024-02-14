import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator'

export enum genders {
  male = 'male',
  female = 'female',
}
export class CreateUserDto {

  @ApiProperty({
    example: '33467854390',
    description: 'User CPF (Cadastro de Pessoas Físicas).',
    required: true,
  })
  @IsString()
  @MinLength(5)
  cpf: string
  
  @ApiProperty({
    example: 'adumbledore@howarts.magic',
    description: 'User email.',
  })
  @IsOptional()
  @IsEmail()
  email?: string
  
  @ApiProperty({
    example: 'ADumbledore_1881',
    description: 'User password.',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  @IsOptional()
  password?: string
  
  @IsBoolean() 
  @IsOptional() 
  isActive?: boolean
  
  @ApiProperty({
    example: '646ae975732fecc4a485707d',
    description: 'Role ID.',
    required: false,
  })
  @IsString()
  @MinLength(4)
  @IsOptional() 
  role?: string

  /**
   * USER DATA
   */

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
    description: 'User profile picture ID.',
  })
  @IsString()
  @IsOptional()
  profilePicture?: string
  
  @ApiProperty({
    example: '',
    description: 'User address picture ID.',
  })
  @IsString()
  @IsOptional()
  addressPicture?: string

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
}
