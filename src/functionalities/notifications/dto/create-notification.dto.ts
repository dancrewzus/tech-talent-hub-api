import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateNotificationDto {
  
  @ApiProperty({
    example: 'Haz recibido una nueva postulación.',
    description: 'Notification title',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  title: string
  
  @ApiProperty({
    example: 'El usuario adumbledore ha postulado en una de tus publicaciones.',
    description: 'Notification description',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  description: string
}
