import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class CreateRoleDto {
  
  @IsString() 
  @ApiProperty({ example: 'Administrator', description: 'Role name.', uniqueItems: true })
  name: string
  
  @IsBoolean() 
  @ApiProperty({ example: false, description: 'It\'s used as default.' })
  primary: boolean
}
