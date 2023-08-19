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
  private populateUserData = { path: 'data' }

  private getUserPermissions = (roleName: string): string => {
    switch (roleName) {
      case 'root': return 'Rt';
      case 'admin': return 'Adm';
      case 'client': return 'Clt';
      case 'collector': return 'Cll';
      default: return '';
    }
  }

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatReturnData = (user: User) => {
    if(!user.isActive) return
    const permission: string = user.role 
      ? this.getUserPermissions(user.role.name) 
      : ''

    return {
      permission,
      id: user.id,
      cpf: user.cpf,
      email: user.email,
      isLogged: user.isLogged,
      fullname: `${ this.capitalizeFirstLetter(user.data?.firstName) } ${ this.capitalizeFirstLetter(user.data?.paternalSurname) }` || '',
      firstName: this.capitalizeFirstLetter(user.data?.firstName) || '',
      secondName: this.capitalizeFirstLetter(user.data?.secondName) || '',
      paternalSurname: this.capitalizeFirstLetter(user.data?.paternalSurname) || '',
      maternalSurname: this.capitalizeFirstLetter(user.data?.maternalSurname) || '',
      birthDate: user.data?.birthDate || '',
      profilePicture: user.data?.profilePicture || '',
      residenceAddress: user.data?.residenceAddress || '',
      billingAddress: user.data?.billingAddress || '',
      phoneNumber: user.data?.phoneNumber || '',
    }
  }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) return 'id'
    if(isNaN(Number(search))) return 'cpf'
    return 'invalid'
  }
  
  public create = async (createUserDto: CreateUserDto) => {
    try {
      const { cpf, role, password, email, data } = createUserDto;
      const databaseRole = await this.roleService.findOne(role as string || 'client' as string)
      if(!databaseRole) {
        throw new NotFoundException(`Role with id or name "${ role }" not found`)
      }
      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password ? password : cpf }`, 10),
        role: databaseRole.id, 
        email,
        cpf,
      });
      if(data) {
        const createdData = await this.userDataService.create({ ...data, user: user._id })
        await this.userModel.updateOne({ _id: user._id }, { data: createdData._id });
        user.data = createdData
      }
      user.role = databaseRole
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findUsers = async (paginationDto: PaginationDto) => {
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
  
  public findClients = async (/* paginationDto: PaginationDto */) => {
    const databaseRole = await this.roleService.findOne('client' as string)
    if(!databaseRole) {
      throw new NotFoundException(`Role with name "client" not found`)
    }
    // const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      const clients = await this.userModel.find({ role: databaseRole.id, isActive: true })
        // .limit( limit )
        // .skip( offset )
        .sort({
          cratedAt: 1
        })
        .populate(this.populateRole)
        .populate(this.populateUserData)
      return clients.map((client) => this.formatReturnData(client))
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
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
          case 'cpf':
            user = await this.userModel.findOne({ cpf: search.toLocaleLowerCase() })
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

  public update = async (search: string, updateUserDto: UpdateUserDto) => {
    const user = await this.findOne(search)
    try {
      updateUserDto.cpf = updateUserDto.cpf.toLowerCase().trim();
      await user.updateOne(updateUserDto)
      return { ...user.toJSON(), ...updateUserDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
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
