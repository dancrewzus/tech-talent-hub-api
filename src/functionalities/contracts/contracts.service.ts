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

  private formatReturnData = (contract: Contract) => {
    return {
      id: contract.id,
      createdBy: contract.createdBy || '',
      client: contract.client || '',
      modality: contract.modality || '',
      modalityOptions: contract.modalityOptions || '',
      loanAmount: contract.loanAmount || '',
      percent: contract.percent || '',
      payments: contract.payments || '',
      paymentAmount: contract.paymentAmount || '',
      totalAmount: contract.totalAmount || '',
      nonWorkingDays: contract.nonWorkingDays || '',
      status: contract.status || '',
      lastContractDate: contract.lastContractDate || '',
      paymentList: contract.paymentList || [],
      createdAt: contract.createdAt || '',
      updatedAt: contract.updatedAt || '',
    }
  }

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
      const contractsByUser = await this.contractModel
        .find({ client: search })
        .sort({ createdAt: 'asc' })
        .populate('paymentList')
      if(!contractsByUser) {
        throw new NotFoundException(`Contracts of user "${ search }" not found`)
      }
      return contractsByUser.map((contract) => this.formatReturnData(contract));
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
