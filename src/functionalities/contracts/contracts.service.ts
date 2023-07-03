import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateContractDto } from './dto/create-contract.dto';
import { HandleErrors } from '../../common/utils/handleErrors.util';
import { Contract } from './entities/contracts.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ContractsService {

  private defaultLimit: number;

  private populate = { path: 'exercise', select: 'name slug imageUrl' }

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
      const { createdBy, client, ...contractData } = createContractDto
      if(userRequest.id !== createdBy) {
        throw new BadRequestException(`Invalid user`)
      }
      const clientExist = await this.userModel.findOne({ id: client })
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
        .sort({
          cratedAt: 1
        })
        .populate(this.populate)
        .populate({ path: 'user' })
    } catch (error) {
      
    }
  }

  public findMany = async (search: string) => {
    try {
      const contractsByUser = await this.contractModel.find({ user: search }).populate(this.populate)
      if(!contractsByUser) {
        throw new NotFoundException(`Contracts of user "${ search }" not found`)
      }
      return contractsByUser;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
    try {
      const contractById = await this.contractModel.findById(search).populate(this.populate)
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
