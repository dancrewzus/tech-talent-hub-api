import { Injectable } from "@nestjs/common";

import { HandleErrors } from "../utils/utils";

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Caracas')

// Constants for date and date-time formats
const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
const DATE_FORMAT = 'DD/MM/YYYY';

@Injectable()
export class DayJSAdapter {

  constructor(
    private readonly errors: HandleErrors,
  ) { }
  
  /**
   * Retrieves the current date in 'DD/MM/YYYY' format.
   * @returns The current date as a string.
   */
  public getCurrentDate = (): string => {
    try {
      return dayjs().tz().format(DATE_FORMAT)
    } catch (error) {
      this.errors.handleError(`Error retrieving the current date: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  /**
   * Retrieves the current date and time in 'DD/MM/YYYY HH:mm:ss' format.
   * @returns The current date and time as a string.
   */
  public getCurrentDateTime = (): string => {
    try {
      return dayjs().tz().format(DATE_TIME_FORMAT)
    } catch (error) {
      this.errors.handleError(`Error retrieving the current date and time: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}