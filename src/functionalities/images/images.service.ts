import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { CreateImageDto } from './dto/create-image.dto'
import { User } from '../users/entities/user.entity'
import { Image } from './entities/image.entity'

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as dayjs from 'dayjs'
dayjs.extend(customParseFormat)

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
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

      const image = await this.imageModel.create({
        createdBy: userRequest.id,
        ...cloudResponse,
      });
      return this.formatReturnData(image);
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    // const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    // try {
    //   return await this.imageModel.find()
    //     .limit( limit )
    //     .skip( offset )
    //     .sort({ createdAt: 'asc' })
    //     .populate({ path: 'user' })
    // } catch (error) {
    //   this.handleErrors.handleExceptions(error)
    // }
  }

  public findOne = async (search: string) => {
    // console.log("🚀 ~ file: contracts.service.ts:127 ~ ContractsService ~ findOne= ~ search:", search)
    // try {
    //   const contractById = await this.imageModel.findById(search)
    //   if(!contractById) {
    //     throw new NotFoundException(`Contract with id "${ search }" not found`)
    //   }
    //   return contractById;
    // } catch (error) {
    //   this.handleErrors.handleExceptions(error)
    // }
  }

  public remove = async (id: string) => {
    // const { modifiedCount } = await this.imageModel.updateOne({ _id: id }, { status: false })
    // if(modifiedCount === 0)
    //   throw new NotFoundException(`Contract with id "${ id }" not found.`)
    // return
  }
}
