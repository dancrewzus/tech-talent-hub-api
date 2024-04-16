import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'

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

import { HandleErrors } from 'src/common/utils/handleErrors.util';
// import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Image } from '../images/entities/image.entity';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly roleService: RolesService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private populateRole = { path: 'role', select: 'name' }

  private getUserPermissions = (roleName: string): string => {
    switch (roleName) {
      case 'root': return 'Rt';
      case 'admin': return 'Adm';
      case 'client': return 'Clt';
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
        email: user.email,
        fullname: `${ this.capitalizeFirstLetter(user.name) } ${ this.capitalizeFirstLetter(user.surname) }` || '',
        name: this.capitalizeFirstLetter(user.name) || '',
        surname: this.capitalizeFirstLetter(user.surname) || '',
        profilePicture: user.profilePicture?.imageUrl || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role?.name || '',
    }
  }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) return 'id'
    // if() return 'email' TODO: Validate email with regex
    return 'invalid'
  }
  
  public create = async (createUserDto: CreateUserDto, userRequest: User) => {
    try {
      
      const now = dayjs.tz()
      const { role, password, email, profilePicture, ...data } = createUserDto;
      const databaseRole = await this.roleService.findOne(role as string || 'client' as string)
      if(!databaseRole) {
        throw new NotFoundException(`Role with id or name "${ role }" not found`)
      }

      let databaseProfilePicture = null
      if(profilePicture !== '') {
        databaseProfilePicture = await this.imageModel.findOne({ _id : profilePicture })
        if(!databaseProfilePicture) {
          throw new NotFoundException(`Image with id "${ profilePicture }" not found`)
        }
      }

      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password ? password : email }`, 10),
        createdBy: userRequest.id,
        role: databaseRole.id,
        profilePicture: databaseProfilePicture?.id || null,
        email,
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        points: databaseRole.name === 'client' ? 2 : 0,
        ...data
      });

      user.role = databaseRole
      user.profilePicture = databaseProfilePicture

      return this.formatReturnData(user)

    } catch (error) {
      const code = error.code || error.status
      if(code === 11000) {
        const key = Object.keys(error.keyPattern)[0];
        const value = error.keyValue[key];
        const user = await this.userModel.findOne({ cpf: value })
                    .populate(this.populateRole)
                    .populate('createdBy')
        return {
          status: 422,
          ok: false,
          data: { user: this.formatReturnData(user) }
        }
      } else {
        this.handleErrors.handleExceptions(error)
      }
    }
  }

  public findUsers = async (paginationDto: any, type: string) => {

    const clientRole = await this.roleService.findOne('client' as string)
    const rootRole = await this.roleService.findOne('root' as string)
    if(!clientRole || !rootRole) {
      throw new NotFoundException(`Role not found`)
    }

    const { limit, offset, filter } = paginationDto ? JSON.parse(paginationDto) : { limit: this.defaultLimit, offset: 0, filter: '' };
    const setOffset = offset === undefined ? 0 : offset
    const setLimit = limit === undefined ? this.defaultLimit : limit
    const isSearch = filter !== '' ? true : false

    try {
      let users: any[] = []
      const notIn = { $nin: [ clientRole.id, rootRole.id ]}
      let data: any = {
        role: type === 'client' ? clientRole.id : notIn,
        isActive: true,
      }

      if(isSearch) {
        data = {
          $or: [
            { 
              cpf: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
              isActive: true,
            },
            {
              firstName: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
              isActive: true,
            },
            {
              paternalSurname: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
              isActive: true,
            },
            {
              phoneNumber: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
              isActive: true,
            },
          ]
        }
      }

      users = await this.userModel.find(data)
        .skip( setOffset )
        .limit( setLimit )
        .sort({ cratedAt: 'asc' })
        .populate(this.populateRole)
        .populate('createdBy')
        .populate('profilePicture')

      const list = users.map((client) => this.formatReturnData(client)).filter((el) => el !== null)

      return {
        data: list,
        count: list.length
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  public findClients = async (paginationDto: any, userRequest: User) => {
    const databaseRole = await this.roleService.findOne('client' as string)
    if(!databaseRole) {
      throw new NotFoundException(`Role with name "client" not found`)
    }
    const { limit, offset, filter } = paginationDto ? JSON.parse(paginationDto) : { limit: this.defaultLimit, offset: 0, filter: '' };
    const setOffset = offset === undefined ? 0 : offset
    const setLimit = limit === undefined ? this.defaultLimit : limit
    const isSearch = filter !== '' ? true : false
    const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)
    try {

      let count = 0
      let clients: any[] = []
        
      let data: any = {
        role: databaseRole.id,
        createdBy: isAdmin ? { $exists: true } : userRequest.id,
        isActive: true
      }
      if(isSearch) {
        data = {
          $or: [
            { 
              title: new RegExp(filter, 'i'),
              role: databaseRole.id,
              createdBy: isAdmin ? { $exists: true } : userRequest.id,
              isActive: true
            },
            {
              slug: new RegExp(filter, 'i'),
              role: databaseRole.id,
              createdBy: isAdmin ? { $exists: true } : userRequest.id,
              isActive: true
            },
            {
              description: new RegExp(filter, 'i'),
              role: databaseRole.id,
              createdBy: isAdmin ? { $exists: true } : userRequest.id,
              isActive: true
            },
          ]
        }
      }
      
      count = await this.userModel.countDocuments(data)
      clients = await this.userModel.find(data)
        .skip( setOffset )
        .limit( setLimit )
        .sort({ cratedAt: 'asc' })
        .populate(this.populateRole)
        .populate('createdBy')
        .populate('profilePicture')

      return {
        data: clients.map((user) => this.formatReturnData(user)),
        count
      }
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
                    .populate('createdBy')
                    .populate('profilePicture')
            break;
          case 'cpf':
            user = await this.userModel.findOne({ cpf: search.toLocaleLowerCase() })
                    .populate(this.populateRole)
                    .populate('createdBy')
                    .populate('profilePicture')
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
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public clientExist = async (search: string) => {
    try {
      let user: User;
      const searchTypeResponse = this.searchType(search)
      try {
        switch (searchTypeResponse) {
          case 'id':
            user = await this.userModel.findById(search)
            break;
          case 'cpf':
            user = await this.userModel.findOne({ cpf: search.toLocaleLowerCase() })
            break;
          default:
            user = null;
            break;
        }
      } catch (error) {
        this.handleErrors.handleExceptions(error)
      }
      return { exist: user ? true : false }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public update = async (search: string, updateUserDto: UpdateUserDto) => {
    console.log("🚀 ~ UsersService ~ update= ~ updateUserDto:", updateUserDto)
    console.log("🚀 ~ UsersService ~ update= ~ search:", search)
    // const user = await this.findOne(search)
    // try {
    //   await user.updateOne(updateUserDto)
    //   return { ...user.toJSON(), ...updateUserDto }
    // } catch (error) {
    //   this.handleErrors.handleExceptions(error)
    // }
  }

  public resetPassword = async (id: string) => {
    try {
      const user = await this.userModel.findById(id)
      if(!user) {
        throw new NotFoundException(`User not found`)
      }
      await this.userModel.updateOne(
        { _id: user.id },
        { 
          password: bcrypt.hashSync(`${ user.email.toLowerCase().trim() }`, 10),
          isLogged: false,
        });


      return
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
