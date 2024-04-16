import { ApiProperty } from "@nestjs/swagger"
import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class PasswordDto {
  
  @ApiProperty({
    example: 'hpotter@howarts.magic',
    description: 'User email.',
    required: true,
  })
  @IsString()
  @MinLength(5)
  email: string
  
  @ApiProperty({
    example: 'Nimbus_2000',
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
}