import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateUserDataDto } from './dto/create-user-data.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { UserData } from './entities/user-data.entity';

@Injectable()
export class UserDataService {

  private defaultLimit: number;

  constructor(
    @InjectModel(UserData.name) private readonly userDataModel: Model<UserData>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private populate = { path: 'user', select: 'email isActive' }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) return 'id'
    if(isNaN(Number(search))) return 'name'
    return 'invalid'
  }
  
  public create = async (createUserDataDto: CreateUserDataDto) => {
    try {
      return this.userDataModel.create(createUserDataDto);
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      return await this.userDataModel.find()
        .limit( limit )
        .skip( offset )
        .sort({
          cratedAt: 1
        })
        .select('-__v')
        .populate(this.populate)
    } catch (error) {
      
    }
  }

  public findOne = async (search: string) => {
    let userData: UserData;
    const searchTypeResponse = this.searchType(search)
    try {
      switch (searchTypeResponse) {
        case 'id':
          userData = await this.userDataModel.findById(search).populate(this.populate)
          break;
        case 'firstName':
          userData = await this.userDataModel.findOne({ firstName: search.toLocaleLowerCase() }).populate(this.populate)
          break;
        default:
          userData = null;
          break;
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
    if(!userData) throw new NotFoundException(`User data with ${ searchTypeResponse } "${ search }" not found`)
    return userData;
  }

  public update = async (search: string, updateUserDataDto: UpdateUserDataDto) => {
    const userData = await this.findOne(search)
    try {
      await userData.updateOne(updateUserDataDto)
      return { ...userData.toJSON(), ...updateUserDataDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    const { deletedCount } = await this.userDataModel.deleteOne({ _id: id })
    if(deletedCount === 0)
      throw new NotFoundException(`User data with id "${ id }" not found.`)
    return
  }
}
