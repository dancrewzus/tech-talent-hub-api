import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateMovementDto {

  @ApiProperty({ type: Number, description: 'Movement amount', example: 132 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number
  
  @ApiProperty({ type: String, description: 'Image ID', example: '654564sd' })
  @IsString()
  @IsOptional()
  paymentPicture: string
  
  @ApiProperty({ type: String, description: 'Movement type', example: 'in' })
  @IsEnum({
    IN: 'in',
    OUT: 'out',
    FINAL: 'final',
  })
  @IsString()
  type: string

  @ApiProperty({ type: String, description: 'Movement description.', example: 'Payment of contract #' })
  @IsString()
  description: string

  @ApiProperty({ type: String, description: 'Movement date. Format DD/MM/YYYY', example: '05/08/2023' })
  @IsString()
  @IsOptional()
  movementDate: string
}
