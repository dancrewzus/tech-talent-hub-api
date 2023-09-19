import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Role } from 'src/functionalities/roles/entities/role.entity'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { User } from '../users/entities/user.entity';
import { SeedData } from './data/data.seed'
import { Contract } from '../contracts/entities/contracts.entity'
import { Payment } from '../payments/entities/payment.entity'
import { Movement } from '../movements/entities/movement.entity'
import { Image } from '../images/entities/image.entity'

@Injectable()
export class SeedService {

  private logger

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name) private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly seedData: SeedData
  ) {
    this.logger = new Logger('Seed Service')
  }

  private seedAuthenticationData = async () => {
    // CLEAR contracts and payments
    await this.imageModel.deleteMany()
    await this.contractModel.deleteMany()
    await this.movementModel.deleteMany()
    await this.paymentModel.deleteMany()
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
}
