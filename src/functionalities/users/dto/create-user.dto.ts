import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, IsOptional, IsEmail, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {

  @ApiProperty({
    example: 'adumbledore@howarts.magic',
    description: 'User email.',
    uniqueItems: true,
  })
  @IsEmail() 
  email: string

  @ApiProperty({
    example: '334.678.543-90',
    description: 'User CPF (Cadastro de Pessoas Físicas).',
    required: true,
  })
  @IsString()
  @MinLength(14)
  cpf: string
  
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
  password: string
  
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
}
