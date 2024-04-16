import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LoginResponseDto {

  @ApiProperty()
  @IsString()
  id: string
  
  @ApiProperty()
  @IsString()
  token: string
}