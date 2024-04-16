import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Caracas')

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';

@Injectable()
export class HandleErrors {

  private createMessage = (message: string): string => {
    return `${ message }`
  }

  private createDuplicatedMessage = (error): string => {
    const key = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[key];
    return this.createMessage(`'${ value }' ${ key } already exists`)
  }
  
  public handleExceptions = (error: any): never => {
    console.error("Error:", error)
    const code = error.code || error.status

    switch (code) {
      case 11000: throw new UnprocessableEntityException(this.createDuplicatedMessage(error))
      case 23505: throw new BadRequestException(this.createMessage(error.message))
      case 401: throw new UnauthorizedException(this.createMessage(error.message))
      case 404: throw new NotFoundException(this.createMessage(error.message))
      case 3000: throw new UnprocessableEntityException(error.message)
      default: throw new InternalServerErrorException(`An internal error has occurred: ${ error.message }`)
    }
  }

  public handleError = (errorMessage): never => {
    console.error(`[${dayjs().format(DATE_TIME_FORMAT)}] - ${errorMessage}`);
    // TODO Implement Datadog tracking here
    throw new Error(errorMessage)

  }
}
