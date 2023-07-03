import { Injectable } from "@nestjs/common";

@Injectable()
export class Utils {

  public convertToSlug = (string) => string.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}