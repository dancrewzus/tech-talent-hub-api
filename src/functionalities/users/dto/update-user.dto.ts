import { IsBoolean, IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

import { UserData } from '../../user-data/entities/user-data.entity';

export class UpdateUserDto {
  
  @IsEmail()
  @IsOptional()
  email?: String

  @IsObject()
  @IsOptional()
  data?: UserData
  
  @IsBoolean()
  @IsOptional()
  isActive?: Boolean
}
