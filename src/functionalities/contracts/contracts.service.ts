import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
// import * as dayjs from 'dayjs'

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { CreateContractDto } from './dto/create-contract.dto'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { Contract } from './entities/contracts.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class ContractsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createContractDto: CreateContractDto, userRequest: User) => {
    try {
      console.log("🚀 ~ file: contracts.service.ts:27 ~ ContractsService ~ create= ~ createContractDto:", createContractDto)
      const { client, ...contractData } = createContractDto
      const clientExist = await this.userModel.findOne({ _id: client })
      if(!clientExist) {
        throw new BadRequestException(`Invalid client`)
      }
      const contract = await this.contractModel.create({
        createdBy: userRequest.id,
        client: clientExist.id,
        ...contractData,
      });
      return contract;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      return await this.contractModel.find()
        .limit( limit )
        .skip( offset )
        .sort({ createdAt: 'asc' })
        .populate({ path: 'user' })
    } catch (error) {
      
    }
  }

  public findMany = async (search: string) => {
    try {
      const contractsByUser: Contract[] = await this.contractModel.find({ client: search }).sort({ createdAt: 'asc' })
      if(!contractsByUser) {
        throw new NotFoundException(`Contracts of user "${ search }" not found`)
      }
      // contractsByUser.sort((a, b) => (dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1))
      return contractsByUser;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
    try {
      const contractById = await this.contractModel.findById(search)
      if(!contractById) {
        throw new NotFoundException(`Contract with id "${ search }" not found`)
      }
      return contractById;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    const { modifiedCount } = await this.contractModel.updateOne({ _id: id }, { status: false })
    if(modifiedCount === 0)
      throw new NotFoundException(`Contract with id "${ id }" not found.`)
    return
  }
}
