import { PartialType } from '@nestjs/swagger';
import { CreateModalityDto } from './create-modality.dto';

export class UpdateModalityDto extends PartialType(CreateModalityDto) {}
