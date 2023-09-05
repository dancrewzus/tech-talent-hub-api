import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';

import { HandleErrors } from '../../common/utils/handleErrors.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) return 'id'
    if(!isNaN(Number(search))) return 'number'
    if(isNaN(Number(search))) return 'name'
    return 'invalid'
  }

  public create = async (createRoleDto: CreateRoleDto) => {
    try {
      createRoleDto.name = createRoleDto.name.toLowerCase();
      const role = await this.roleModel.create(createRoleDto);
      return role;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      return await this.roleModel.find({
          name: { $nin: [ 'root', 'client' ]}
        })
        .limit( limit )
        .skip( offset )
        .sort({
          cratedAt: 1
        })
        .select('name')
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
    let role: Role;
    const searchTypeResponse = this.searchType(search)
    try {
      switch (searchTypeResponse) {
        case 'id':
          role = await this.roleModel.findById(search)
          break;
        case 'number':
          role = await this.roleModel.findOne({ no: search })
          break;
        case 'name':
          role = await this.roleModel.findOne({ name: search.toLocaleLowerCase() })
          break;
        default:
          role = null;
          break;
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
    if(!role) throw new NotFoundException(`Role with ${ searchTypeResponse } "${ search }" not found`)
    return role;
  }

  public update = async (search: string, updateRoleDto: UpdateRoleDto) => {
    const role = await this.findOne(search)
    if(updateRoleDto.name) updateRoleDto.name = updateRoleDto.name.toLocaleLowerCase()
    try {
      await role.updateOne(updateRoleDto)
      return { ...role.toJSON(), ...updateRoleDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    const { deletedCount } = await this.roleModel.deleteOne({ _id: id })
    if(deletedCount === 0)
      throw new NotFoundException(`Role with id "${ id }" not found.`)
    return
  }
}
