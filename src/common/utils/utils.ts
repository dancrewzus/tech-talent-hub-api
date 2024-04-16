import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {

  public convertToSlug = (string) => string.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  public timer = (ms) => new Promise(res => setTimeout(res, ms))

  public extractContentResponse = (content: any): string => content?.text?.value || ''
}

export { HandleErrors } from './handleErrors.util';