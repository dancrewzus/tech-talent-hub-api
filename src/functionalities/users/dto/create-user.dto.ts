import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, IsOptional, IsEmail, Matches, MaxLength, MinLength, IsObject } from 'class-validator'

export class CreateUserDto {

  // cpf      : '',
  // email    : '',
  
  // name     : '',
  // lastname : '',
  // gender   : '',
  // residence: '',
  // work     : '',
  // phone    : '',

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
  @IsString()
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
  @MinLength(6)
  @IsOptional() 
  role?: string

  /**
   * USER DATA
   */

  @ApiProperty({
    example: '{ name: "Albus", lastname: "Dumbledore" }',
    description: 'User data.',
  })
  @IsOptional()
  @IsObject() 
  data?: any
}
