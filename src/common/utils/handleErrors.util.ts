import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'

@Injectable()
export class HandleErrors {

  private createMessage = (message: string): string => {
    return `${ message }, please verify and try again.`
  }

  private createDuplicatedMessage = (error): string => {
    const key = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[key];
    return this.createMessage(`'${ value }' ${ key } already exists`)
  }
  
  public handleExceptions = (error: any): never => {
    console.log("🚀 ~ file: handleErrors.util.ts:24 ~ HandleErrors ~ error:", error)
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
}
