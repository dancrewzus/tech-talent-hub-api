import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: String, metadata: ArgumentMetadata) {
    if(!isValidObjectId(value)) {
      throw new BadRequestException(`${ value } isn't a valid MongoID.`)
    }
    return value;
  }
}
