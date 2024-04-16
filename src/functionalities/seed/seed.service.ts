import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { Image } from '../images/entities/image.entity'
import { User } from '../users/entities/user.entity';

import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { SeedData } from './data/data.seed'

@Injectable()
export class SeedService {

  private logger

  constructor(    
    @InjectModel(Image.name, 'production') private readonly imageModelProduction: Model<Image>,
    @InjectModel(Role.name, 'production') private readonly roleModelProduction: Model<Role>,
    @InjectModel(User.name, 'production') private readonly userModelProduction: Model<User>,

    @InjectModel(Image.name, 'test') private readonly imageModel: Model<Image>,
    @InjectModel(Role.name, 'test') private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'test') private readonly userModel: Model<User>,

    private readonly handleErrors: HandleErrors,
    private readonly cloudAdapter: CloudAdapter,
    private readonly seedData: SeedData
  ) {
    this.logger = new Logger('Seed Service')
  }

  private seedAuthenticationData = async () => {
    // DELETE All images

    await this.cloudAdapter.deleteAllResources()

    // CLEAR contracts and payments
    await this.imageModel.deleteMany()
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
    let superUser;
    for (let index = 0; index < usersBeforeInsert.length; index++) {
      const user = usersBeforeInsert[index];
      const { password, role, ...data } = user
      const role_ = createdRoles.find((el) => el.name === role)
      if(index === 0) {
        superUser = await this.userModel.create({
          password: bcrypt.hashSync(`${ password }`, 10),
          role: role_ ? role_.id : primaryRole.id,
          ...data,
        })
      } else {
        usersToInsert.push({
          password: bcrypt.hashSync(`${ password }`, 10),
          role: role_ ? role_.id : primaryRole.id,
          createdBy: superUser ? superUser.id : null,
          ...data,
        })
      }
    }
    await this.userModel.insertMany(usersToInsert)
    this.logger.log('Users seeded')
  }

  public seedAll = async () => {
    try {
      await this.seedAuthenticationData()
      // await this.seedFunctionalitiesData()
      return `All seeded`;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public cloneDatabase = async ({ }) => {
    try {
      const [
        images,
        roles,
        users
      ] = await Promise.all([
        this.imageModelProduction.find(),
        this.roleModelProduction.find(),
        this.userModelProduction.find(),
      ])

      await Promise.all([
        this.imageModel.deleteMany(),
        this.roleModel.deleteMany(),
        this.userModel.deleteMany(),
      ])
      await this.roleModel.insertMany(roles)
      await this.userModel.insertMany(users)
      await this.imageModel.insertMany(images)

      return 'Copia de seguridad realizada con éxito'

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
