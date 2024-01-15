import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * DATE MANAGEMENT
 */

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Manaus')

// END DATE MANAGEMENT

import { User } from 'src/functionalities/users/entities/user.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { CreateHoliDayDto, UpdateHoliDayDto } from './dto';
import { Holiday } from './entities/holiday.entity';

@Injectable()
export class HolidaysService {

  private defaultLimit: number;

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  constructor(
    @InjectModel(Holiday.name, 'default') private readonly holidayModel: Model<Holiday>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createHolidayDto: CreateHoliDayDto, userRequest: User) => {
    try {
      const now = dayjs.tz()
      const { holidayDate } = createHolidayDto
      const isValidDate = dayjs(holidayDate, 'DD/MM/YYYY').isValid()
      if(!isValidDate) {
        throw {
          code: 3000,
          message: 'La fecha ingresada no es válida',
        }
      }
      return this.holidayModel.create({
        holidayDate,
        createdBy: userRequest.id,
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      })
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async () => {
    try {
      const list = await this.holidayModel.find().sort({ holidayDate: 'desc' })
      return {
        data: list,
        count: list.length
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  public update = async (id: string, updateHolidayDto: UpdateHoliDayDto) => {
    const holiday = await this.holidayModel.findById(id)
    try {
      await holiday.updateOne(updateHolidayDto)
      return { ...holiday.toJSON(), ...updateHolidayDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    try {
      const { deletedCount } = await this.holidayModel.deleteOne({ _id: id })
      if(deletedCount === 0)
        throw new NotFoundException(`No se ha podido encontrar el feriado "${ id }"`)
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
