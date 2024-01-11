import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Geolocation } from '../movements/entities/location.entity'
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { Contract } from '../contracts/entities/contracts.entity'
import { Movement } from '../movements/entities/movement.entity'
import { Payment } from '../payments/entities/payment.entity'
import { Image } from '../images/entities/image.entity'
import { User } from '../users/entities/user.entity';

import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { SeedData } from './data/data.seed'

@Injectable()
export class SeedService {

  private logger

  constructor(
    @InjectModel(Geolocation.name, 'production') private readonly geolocationModelProduction: Model<Geolocation>,
    @InjectModel(Contract.name, 'production') private readonly contractModelProduction: Model<Contract>,
    @InjectModel(Movement.name, 'production') private readonly movementModelProduction: Model<Movement>,
    @InjectModel(Payment.name, 'production') private readonly paymentModelProduction: Model<Payment>,
    @InjectModel(Image.name, 'production') private readonly imageModelProduction: Model<Image>,
    @InjectModel(Role.name, 'production') private readonly roleModelProduction: Model<Role>,
    @InjectModel(User.name, 'production') private readonly userModelProduction: Model<User>,

    @InjectModel(Geolocation.name, 'test') private readonly geolocationModel: Model<Geolocation>,
    @InjectModel(Contract.name, 'test') private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name, 'test') private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name, 'test') private readonly paymentModel: Model<Payment>,
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

  public cloneDatabase = async ({ }) => {
    try {
      // GET RESOURCES FROM ORIGIN
      const [ 
        geolocation, 
        contracts, 
        movements,
        payments,
        images,
        roles,
        users
      ] = await Promise.all([
        this.geolocationModel.find(),
        this.contractModel.find(),
        this.movementModel.find(),
        this.paymentModel.find(),
        this.imageModel.find(),
        this.roleModel.find(),
        this.userModel.find(),
      ])

      // STORE RESOURCES TO DESTINY
      await Promise.all([
        this.geolocationModelProduction.deleteMany(),
        this.contractModelProduction.deleteMany(),
        this.movementModelProduction.deleteMany(),
        this.paymentModelProduction.deleteMany(),
        this.imageModelProduction.deleteMany(),
        this.roleModelProduction.deleteMany(),
        this.userModelProduction.deleteMany(),
      ])
      await this.roleModelProduction.insertMany(roles)
      await this.userModelProduction.insertMany(users)
      await this.contractModelProduction.insertMany(contracts)
      await this.movementModelProduction.insertMany(movements)
      await this.paymentModelProduction.insertMany(payments)
      await this.imageModelProduction.insertMany(images)
      await this.geolocationModelProduction.insertMany(geolocation)

      return 'Copia de seguridad realizada con éxito'

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
