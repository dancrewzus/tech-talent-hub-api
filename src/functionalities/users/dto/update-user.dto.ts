import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { genders } from './create-user.dto';

export class UpdateUserDto {
  
  @ApiProperty({
    example: 'Albus',
    description: 'User name.',
  })
  @IsString()
  @IsOptional()
  name?: string
  
  @ApiProperty({
    example: 'Dumbledore',
    description: 'User lastname.',
  })
  @IsString()
  @IsOptional()
  surname?: string
  
  @ApiProperty({
    example: 'male',
    description: 'User gender.',
  })
  @IsString()
  @IsEnum(genders)
  @IsOptional()
  gender?: string
  
  @ApiProperty({
    example: '123456789',
    description: 'User phone number.',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  phoneNumber?: string

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
