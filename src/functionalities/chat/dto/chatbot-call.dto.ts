import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class ChatbotCallDto {
  
  @ApiProperty({
    example: 'Hola!',
    description: 'Client message',
    required: true,
  })
  @IsString()
  @MinLength(1)
  message: string

  @ApiProperty({
    example: '+56945457878',
    description: 'Client number (Chat origin)',
    required: true,
  })
  @IsString()
  @MinLength(10)
  clientNumber: string
}
