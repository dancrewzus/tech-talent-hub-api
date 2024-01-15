import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateHoliDayDto {
  
  @ApiProperty({ type: String, description: 'Holiday date.', example: '01/01/2024' })
  @IsString()
  holidayDate: string
}
