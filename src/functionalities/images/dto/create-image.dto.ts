import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateImageDto {
  
  @ApiProperty({ type: String, description: 'Image base 64', example: '...' })
  @IsString()
  base64: string
  
  @ApiProperty({ type: String, description: 'Image type', example: 'client or payment' })
  @IsString()
  type: string
}