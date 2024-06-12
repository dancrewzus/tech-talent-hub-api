import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateOfferDto {
  
  @ApiProperty({ type: String, description: 'Offer title', example: 'Frontend Developer' })
  @IsString()
  title: string
  
  @ApiProperty({ type: String, description: 'Offer title slug', example: 'frontend-developer' })
  @IsString()
  slug: string
  
  @ApiProperty({ type: String, description: 'Offer description', example: 'We require a frontend developer with technical skills in...' })
  @IsString()
  description: string
  
  @ApiProperty({ type: Number, description: 'Offer salary min range', example: 3000 })
  @IsNumber()
  @IsPositive()
  salaryMin: number
  
  @ApiProperty({ type: Number, description: 'Offer salary max range', example: 4100 })
  @IsNumber()
  @IsPositive()
  salaryMax: number
  
  @ApiProperty({ type: String, description: 'Offer salary currency (code)', example: 'USD' })
  @IsString()
  currency: string
  
  @ApiProperty({ type: String, description: 'Offer country', example: 'Venezuela' })
  @IsString()
  country: string
  
  @ApiProperty({ type: Boolean, description: 'Offer remote option', example: true })
  @IsBoolean()
  remote: boolean

  @ApiProperty({ type: String, description: 'Offer category ID', example: '654s6f54d-fe5d6f465er-evg5h1bn8t' })
  @IsString()
  category: string
}