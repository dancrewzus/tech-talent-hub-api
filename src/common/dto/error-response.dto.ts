import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ErrorResponseDto {
  @ApiProperty({
    type: Number
  })
  @IsNumber()
  public statusCode: number;
  
  @ApiProperty({
    type: String
  })
  @IsString()
  public message: string;
  
  @ApiProperty({
    type: String
  })
  @IsString()
  public error: string;
}