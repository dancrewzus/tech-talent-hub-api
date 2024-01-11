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

dayjs.tz.setDefault('America/Manaus')

// END DATE MANAGEMENT

import { Geolocation } from '../movements/entities/location.entity';
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
    @InjectModel(Geolocation.name, 'default') private readonly locationModel: Model<Geolocation>,
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
      fullname: `${ this.capitalizeFirstLetter(user.firstName) } ${ this.capitalizeFirstLetter(user.paternalSurname) }` || '',
      firstName: this.capitalizeFirstLetter(user.firstName) || '',
      secondName: this.capitalizeFirstLetter(user.secondName) || '',
      paternalSurname: this.capitalizeFirstLetter(user.paternalSurname) || '',
      maternalSurname: this.capitalizeFirstLetter(user.maternalSurname) || '',
      birthDate: user.birthDate || '',
      profilePicture: user.profilePicture?.imageUrl || '',
      addressPicture: user.addressPicture?.imageUrl || '',
      residenceAddress: user.residenceAddress || '',
      billingAddress: user.billingAddress || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role?.name || '',
      gender: user.gender || '',
      points: user.points || 0,
      geolocation: user.geolocation || {},
      createdBy: user.createdBy ? this.formatReturnData(user.createdBy) : null,
    }
  }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) return 'id'
    if(!isNaN(Number(search))) return 'cpf'
    return 'invalid'
  }
  
  public create = async (createUserDto: CreateUserDto, userRequest: User) => {
    try {
      
      const now = dayjs.tz()
      const { cpf, role, password, email, profilePicture, addressPicture, ...data } = createUserDto;
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

      let databaseAddressPicture = null
      if(addressPicture !== '') {
        databaseAddressPicture = await this.imageModel.findOne({ _id : addressPicture })
        if(!databaseAddressPicture) {
          throw new NotFoundException(`Image with id "${ addressPicture }" not found`)
        }
      }

      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password ? password : cpf }`, 10),
        createdBy: userRequest.id,
        role: databaseRole.id,
        profilePicture: databaseProfilePicture?.id || null,
        addressPicture: databaseAddressPicture?.id || null,
        email,
        cpf,
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        points: databaseRole.name === 'client' ? 2 : 0,
        ...data
      });

      user.role = databaseRole
      user.profilePicture = databaseProfilePicture
      user.addressPicture = databaseAddressPicture

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

      let count = 0
      let users: any[] = []
      const notIn = { $nin: [ clientRole.id, rootRole.id ]}
      let data: any = {
        role: type === 'client' ? clientRole.id : notIn,
      }

      if(isSearch) {
        data = {
          $or: [
            { 
              cpf: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
            },
            {
              firstName: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
            },
            {
              paternalSurname: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
            },
            {
              phoneNumber: new RegExp(filter, 'i'),
              role: type === 'client' ? clientRole.id : notIn,
            },
          ]
        }
      }

      count = await this.userModel.count(data)
      users = await this.userModel.find(data)
        .skip( setOffset )
        .limit( setLimit )
        .sort({ cratedAt: 'asc' })
        .populate(this.populateRole)
        .populate('createdBy')
        .populate('profilePicture')
        .populate('addressPicture')

      return {
        data: users.map((client) => this.formatReturnData(client)),
        count
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
      
      count = await this.userModel.count(data)
      clients = await this.userModel.find(data)
        .skip( setOffset )
        .limit( setLimit )
        .sort({ cratedAt: 'asc' })
        .populate(this.populateRole)
        .populate('createdBy')
        .populate('profilePicture')
        .populate('addressPicture')

      if(clients.length) {
        for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          client.geolocation = {
            latitude: 0,
            longitude: 0
          }
          const locations = await this.locationModel.find({ client: client._id })
          // console.log("🚀 ~ file: users.service.ts:296 ~ UsersService ~ findClients= ~ locations:", locations)
          if(locations.length) {
            let clientLastLocation = null
            locations.forEach((location) => {
              if(location.latitude !== 0 && location.longitude !== 0) {
                clientLastLocation = location
              }
            });
            if(clientLastLocation) {
              client.geolocation = {
                latitude: clientLastLocation.latitude,
                longitude: clientLastLocation.longitude
              }
            }
          }
        }
      }

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
                    .populate('addressPicture')
            break;
          case 'cpf':
            user = await this.userModel.findOne({ cpf: search.toLocaleLowerCase() })
                    .populate(this.populateRole)
                    .populate('createdBy')
                    .populate('profilePicture')
                    .populate('addressPicture')
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
    const user = await this.findOne(search)
    try {
      await user.updateOne(updateUserDto)
      return { ...user.toJSON(), ...updateUserDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
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
          password: bcrypt.hashSync(`${ user.cpf.toLowerCase().trim() }`, 10),
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

  public assignInitPoints = async () => {
    const databaseRole = await this.roleService.findOne('client' as string)
    if(!databaseRole) {
      throw new NotFoundException(`Role with name "client" not found`)
    }
    try {
      const clients = await this.userModel.find({
        role: databaseRole.id,
        isActive: true
      })

      if(clients.length) {
        for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          if(!client.points || client.points === 0) {
            client.points = 2
            await client.save()
          }
        }
      }

      return 'Points assigned'
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public clearUsers = async () => {
    try {
      const databaseRole = await this.roleService.findOne('client' as string)
      const clients = await this.userModel.find({ role: databaseRole.id, isActive: true })
      const validNames = ['natali', 'henato', 'jefferson']
      if(clients.length) {
        for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          const isValidClient = validNames.includes(client.firstName.toLowerCase())
          if(!isValidClient) {
            client.isActive = false
            await client.save()
          }
        }
      }
      return 'User deleted'
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
