import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LoginResponseDto {

  @ApiProperty()
  @IsString()
  id: String
  
  @ApiProperty()
  @IsString()
  token: String
}