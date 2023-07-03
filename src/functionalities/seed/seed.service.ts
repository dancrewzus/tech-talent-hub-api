import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Role } from 'src/functionalities/roles/entities/role.entity'
import { UserData } from '../user-data/entities/user-data.entity'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { User } from '../users/entities/user.entity';
import { SeedData } from './data/data.seed'

@Injectable()
export class SeedService {

  private logger

  constructor(
    @InjectModel(UserData.name) private readonly userDataModel: Model<UserData>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly seedData: SeedData
  ) {
    this.logger = new Logger('Seed Service')
  }

  private seedAuthenticationData = async () => {
    // ROLES Seed
    await this.roleModel.deleteMany()
    const rolesToInsert = this.seedData.getRoles()
    const createdRoles = await this.roleModel.insertMany(rolesToInsert)
    this.logger.log('Roles seeded')
    
    // USERS Seed
    await this.userModel.deleteMany()
    const primaryRole = createdRoles.find((role) => role.primary)
    const usersBeforeInsert = this.seedData.getUsers()
    const usersToInsert = []
    usersBeforeInsert.forEach((user) => {
      const { email, password } = user
      const role = createdRoles.find((role) => role.name === user.role)
      usersToInsert.push({
        password: bcrypt.hashSync(`${ password }`, 10),
        role: role ? role.id : primaryRole.id,
        email,
      })
    })
    const createdUsers = await this.userModel.insertMany(usersToInsert)
    this.logger.log('Users seeded')

    // DATA Seed
    await this.userDataModel.deleteMany()
    const dataToInsert = this.seedData.getUsersData()
    for (let index = 0; index < createdUsers.length; index++) {
      const user = createdUsers[index];
      const userData = dataToInsert[index]
      userData.user = user.id
      await this.userDataModel.create(userData);
    }
    this.logger.log('Users data seeded')
  }

  public seedAll = async () => {
    try {
      await this.seedAuthenticationData()
      return `All seeded`;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
