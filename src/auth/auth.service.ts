import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { CreateUserDto } from 'src/functionalities/users/dto/create-user.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { User } from 'src/functionalities/users/entities/user.entity'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    private readonly handleErrors: HandleErrors,
    private readonly jwtService: JwtService
  ) {}

  private getJwtToken = (payload: JwtPayload) => this.jwtService.sign(payload)

  private formatReturnData = (user: User) => {
    const { id, cpf, data } = user
    return {
      user: { id, cpf, data },
      token: this.getJwtToken({ id: `${ id }` })
    }
  }

  private validatePassword = async (plainPassword: string, hashDb: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(plainPassword, hashDb, (err, result) => {
        if(err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }

  public login = async (loginDto: LoginDto) => {
    try {
      const { password, cpf } = loginDto;
      const user = await this.userModel.findOne({ cpf: cpf.toLowerCase().trim() }).select('email cpf password id isActive data').populate({ path: 'data' })
      const isValidPassword = await this.validatePassword(`${ password }`, `${ user?.password }`)
      if(!user || !isValidPassword) {
        throw new UnauthorizedException('Invalid credentials')
      }
      if(!user.isActive) {
        throw new UnauthorizedException('Inactive user')
      }
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public register = async (createUserDto: CreateUserDto) => {
    try {
      const { role, password, ...userData } = createUserDto;
      let roleId = null;
      const roleById = await this.roleModel.findById(role);
      if (!roleById) {
        const primaryRole = await this.roleModel.findOne({ primary: true });
        if (!primaryRole) {
          throw new NotFoundException(`Role not found`);
        }
        roleId = primaryRole.id;
      } else {
        roleId = roleById.id;
      }
      userData.email = userData.email.toLowerCase().trim();
      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password }`, 10),
        role: roleId, 
        ...userData
      });
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  public checkAuthStatus = async (user: User) => {
    try {
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }


  public getValidRoles = async () => {
    const roles = await this.roleModel.find()
    if(!roles || roles.length === 0) {
      return []
    }
    return roles.map(role => `${ role.name }`)
  }

}
