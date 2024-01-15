import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateModalityDto {
  
  @ApiProperty({ type: String, description: 'Title.', example: '10% 4d' })
  @IsString()
  title: string

  @ApiProperty({ type: String, description: 'Value.', example: '10-4' })
  @IsString()
  value: string

  @ApiProperty({ type: Number, description: 'Percent.', example: 10 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  percent: number
  
  @ApiProperty({ type: Number, description: 'Days.', example: 4 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  days: number

  @ApiProperty({ type: Boolean, description: 'Accept days off?.', example: false })
  @IsBoolean()
  offDays: boolean
}
