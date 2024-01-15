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
import { CreateModalityDto, UpdateModalityDto } from './dto';
import { Modality } from './entities/modality.entity';

@Injectable()
export class ModalitiesService {

  private defaultLimit: number;

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  constructor(
    @InjectModel(Modality.name, 'default') private readonly modalityModel: Model<Modality>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createModalityDto: CreateModalityDto, userRequest: User) => {
    try {
      const now = dayjs.tz()
      return this.modalityModel.create({
        ...createModalityDto,
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
      const list = await this.modalityModel.find().sort({ cratedAt: 'asc' })
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

  public update = async (id: string, updateModalityDto: UpdateModalityDto) => {
    const holiday = await this.modalityModel.findById(id)
    try {
      await holiday.updateOne(updateModalityDto)
      return { ...holiday.toJSON(), ...updateModalityDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    try {
      const { deletedCount } = await this.modalityModel.deleteOne({ _id: id })
      if(deletedCount === 0)
        throw new NotFoundException(`No se ha podido encontrar la modalidad "${ id }"`)
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
