import { Injectable } from '@nestjs/common'

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Sao_Paulo')

const FULL_FORMAT = 'DD/MM/YYYY HH:mm:ss'
const SIMPLE_FORMAT = 'DD/MM/YYYY'

@Injectable()
export class TimeHandler {

  static getNow(format = 'full'): string {
    return dayjs().format(format === 'full' ? FULL_FORMAT : SIMPLE_FORMAT)
  }

  private getFormat = (format: string) => {
    return format === 'full' ? FULL_FORMAT : SIMPLE_FORMAT
  }
  
  public getNow(format = 'full'): string {
    return dayjs().format(this.getFormat(format))
  }

  public getTimeEntity = () => {
    return dayjs()
  }

  public formatDate = ({ date, format }) => {
    return dayjs(date, this.getFormat(format), true)
  }
  
  public formatDateString = ({ date, format }) => {
    return dayjs(date, this.getFormat(format), true).format('DD/MM/YYYY')
  }
}
