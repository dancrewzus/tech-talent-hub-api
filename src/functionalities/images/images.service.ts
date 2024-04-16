import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

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

dayjs.tz.setDefault('America/Caracas')

// END DATE MANAGEMENT

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { CreateImageDto } from './dto/create-image.dto'
import { User } from '../users/entities/user.entity'
import { Image } from './entities/image.entity'

@Injectable()
export class ImagesService {

  private defaultLimit: number;

  private formatReturnData = (image: Image) => {
    const mapped = {
      id: image.id || '',
    }
    return mapped
  }

  constructor(
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly cloudAdapter: CloudAdapter,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createImageDto: CreateImageDto, userRequest: User) => {
    try {
      const { base64, type } = createImageDto

      const cloudResponse = await this.cloudAdapter.uploadImage(base64, type)

      const now = dayjs.tz()
      const image = await this.imageModel.create({
        createdBy: userRequest.id,
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        ...cloudResponse,
      });
      return this.formatReturnData(image);
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
