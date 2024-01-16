import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class LoginDto {
  
  @ApiProperty({
    example: '334.678.543-90',
    description: 'CPF del usuario.',
    required: true,
  })
  @IsString()
  @MinLength(4)
  cpf: string
  
  @ApiProperty({
    example: 'ADumbledore_1881',
    description: 'Contraseña del usuario.',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  password: string
}