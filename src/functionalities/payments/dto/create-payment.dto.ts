import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreatePaymentDto {

  @ApiProperty({ type: String, description: 'Client ID', example: '6472d32b20f00d485b965c1e' })
  @IsString()
  client: string
  
  @ApiProperty({ type: String, description: 'Contract ID', example: '6472d32b20f00d485b965c1e' })
  @IsString()
  contract: string
  
  @ApiProperty({ type: String, description: 'Image URL', example: 'http://...' })
  @IsOptional()
  @IsString()
  imageUrl: string
  
  @ApiProperty({ type: String, description: 'Payment date. Format DD/MM/YYYY', example: '05/08/2023' })
  @IsString()
  paymentDate: string
  
  @ApiProperty({ type: Number, description: 'Payment number', example: 3 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  paymentNumber: number
  
  @ApiProperty({ type: Number, description: 'Payment amount', example: 132 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number
}
