import { PartialType } from '@nestjs/swagger';
import { CreateUserDataDto } from './create-user-data.dto';

export class UpdateUserDataDto extends PartialType(CreateUserDataDto) {}
