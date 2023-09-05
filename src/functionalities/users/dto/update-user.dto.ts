import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { genders } from './create-user.dto';

export class UpdateUserDto {
  
  @ApiProperty({
    example: 'Albus',
    description: 'User name.',
  })
  @IsString() 
  firstName: string
  
  @ApiProperty({
    example: 'Dumbledore',
    description: 'User lastname.',
  })
  @IsString() 
  paternalSurname: string
  
  @ApiProperty({
    example: 'male',
    description: 'User gender.',
  })
  @IsString()
  @IsEnum(genders)
  gender: string

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

  @ApiProperty({
    example: 'adumbledore@howarts.magic',
    description: 'User email.',
  })
  @IsOptional()
  @IsEmail()
  email?: string
  
  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
