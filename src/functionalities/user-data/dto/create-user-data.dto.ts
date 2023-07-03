import { IsObject, IsString } from 'class-validator'

import { User } from '../../users/entities/user.entity'

export class CreateUserDataDto {
  @IsString() firstName: String
  @IsString() secondName: String
  @IsString() paternalSurname: String
  @IsString() maternalSurname: String
  @IsString() birthDate?: String
  @IsString() profilePicture?: String
  @IsObject() user: User
}
