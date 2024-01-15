import { PartialType } from '@nestjs/swagger';
import { CreateHoliDayDto } from './create-holiday.dto';

export class UpdateHoliDayDto extends PartialType(CreateHoliDayDto) {}
