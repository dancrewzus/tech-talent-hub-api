import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class LoginDto {
  
  @ApiProperty({
    example: 'hpotter@howarts.magic',
    description: 'User email',
    required: true,
  })
  @IsString()
  @MinLength(4)
  email: string
  
  @ApiProperty({
    example: 'Nimbus_2000',
    description: 'User password',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  password: string
}