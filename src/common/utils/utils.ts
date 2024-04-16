import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {

  public convertToSlug = (string) => string.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

  public timer = (ms) => new Promise(res => setTimeout(res, ms))

  public extractContentResponse = (content: any): string => content?.text?.value || ''

  public getUserPermissions = (roleName: string): string => {
    switch (roleName) {
      case 'root': return 'Rt';
      case 'admin': return 'Adm';
      case 'client': return 'Clt';
      default: return '';
    }
  }

  public capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export { HandleErrors } from './handleErrors.util';