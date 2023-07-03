import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { UserDataService } from '../user-data/user-data.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private defaultLimit: number;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userDataService: UserDataService,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly roleService: RolesService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private populateRole = { path: 'role', select: 'name' }
  private populateUserData = { path: 'data', select: 'firstName secondName paternalSurname maternalSurname birthDate profilePicture' }

  private searchType = (search: String | number): String => {
    let type: String = 'invalid'
    if(isValidObjectId(search)) return 'id'
    if(isNaN(Number(search))) return 'email'
    return type
  }
  
  public create = async (createUserDto: CreateUserDto) => {
    try {
      const { role, password, ...userData } = createUserDto;
      const databaseRole = await this.roleService.findOne(role as String || 'athlete' as String)
      if(!databaseRole) {
        throw new NotFoundException(`Role with id "${ role }" not found`)
      }
      userData.email = userData.email.toLowerCase().trim();
      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password }`, 10),
        role: databaseRole.id, 
        ...userData
      });
      return user
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      return await this.userModel.find()
        .limit( limit )
        .skip( offset )
        .sort({
          cratedAt: 1
        })
        .populate(this.populateRole)
        .populate(this.populateUserData)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: String) => {
    try {
      let user: User;
      const searchTypeResponse = this.searchType(search)
      try {
        switch (searchTypeResponse) {
          case 'id':
            user = await this.userModel.findById(search)
                    .populate(this.populateRole)
                    .populate(this.populateUserData)
            break;
          case 'email':
            user = await this.userModel.findOne({ email: search.toLocaleLowerCase() })
                    .populate(this.populateRole)
                    .populate(this.populateUserData)
            break;
          default:
            user = null;
            break;
        }
      } catch (error) {
        this.handleErrors.handleExceptions(error)
      }
      if(!user) {
        throw new NotFoundException(`User with ${ searchTypeResponse } "${ search }" not found`)
      }
      return user
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public update = async (search: String, updateUserDto: UpdateUserDto) => {
    const user = await this.findOne(search)
    try {
      updateUserDto.email = updateUserDto.email.toLowerCase().trim();
      await user.updateOne(updateUserDto)
      return { ...user.toJSON(), ...updateUserDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: String) => {
    try {
      const { deletedCount } = await this.userModel.deleteOne({ _id: id })
      if(deletedCount === 0)
        throw new NotFoundException(`User with id "${ id }" not found`)
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
