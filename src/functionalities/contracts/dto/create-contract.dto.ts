import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsPositive, IsString, Min } from 'class-validator'

import { MethodsEnum } from 'src/common/interfaces/methods.enum'

export class CreateContractDto {
  
  @ApiProperty({ type: String, description: 'User creator ID', example: '6472d32b20f00d485b965c1e' })
  @IsString()
  createdBy: string
  
  @ApiProperty({ type: String, description: 'Client ID', example: '6472d32b20f00d485b965c1e' })
  @IsString()
  client: string
  
  @ApiProperty({ type: String, description: 'Payment method', example: 'daily' })
  @IsString()
  @IsEnum(MethodsEnum)
  modality: string

  @ApiProperty({ type: Number, description: 'Loan amount', example: 120 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  loanAmount: number
  
  @ApiProperty({ type: Number, description: 'Loan percent', example: 10 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  percent: number
  
  @ApiProperty({ type: Number, description: 'Payments quantity', example: 20 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  payments: number
  
  @ApiProperty({ type: Number, description: 'Payment amount', example: 6.6 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  paymentAmount: number
  
  @ApiProperty({ type: Number, description: 'Total amount', example: 132 })
  @IsNumber()
  @IsPositive()
  @Min(1)
  totalAmount: number
  
  @ApiProperty({ type: String, description: 'Non-working days', example: 'LuMaMiJuViSaDo' })
  @IsString()
  nonWorkingDays: string
}