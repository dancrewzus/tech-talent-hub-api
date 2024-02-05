import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Geolocation } from '../movements/entities/location.entity'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { Contract } from '../contracts/entities/contracts.entity'
import { Movement } from '../movements/entities/movement.entity'
import { Holiday } from '../holidays/entities/holiday.entity'
import { Modality } from '../modality/entities/modality.entity'
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
    @InjectModel(Modality.name, 'production') private readonly modalityModelProduction: Model<Modality>,
    @InjectModel(Holiday.name, 'production') private readonly holidayModelProduction: Model<Holiday>,

    @InjectModel(Geolocation.name, 'test') private readonly geolocationModel: Model<Geolocation>,
    @InjectModel(Contract.name, 'test') private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name, 'test') private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name, 'test') private readonly paymentModel: Model<Payment>,
    @InjectModel(Image.name, 'test') private readonly imageModel: Model<Image>,
    @InjectModel(Role.name, 'test') private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'test') private readonly userModel: Model<User>,
    @InjectModel(Modality.name, 'test') private readonly modalityModel: Model<Modality>,
    @InjectModel(Holiday.name, 'test') private readonly holidayModel: Model<Holiday>,

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
      const [ 
        geolocation, 
        modalities,
        contracts, 
        movements,
        holidays,
        payments,
        images,
        roles,
        users
      ] = await Promise.all([
        this.geolocationModelProduction.find(),
        this.modalityModelProduction.find(),
        this.contractModelProduction.find().populate('paymentList', '_id').populate('movementList', '_id'),
        this.movementModelProduction.find().populate('paymentList', '_id'),
        this.holidayModelProduction.find(),
        this.paymentModelProduction.find(),
        this.imageModelProduction.find(),
        this.roleModelProduction.find(),
        this.userModelProduction.find(),
      ])

      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", geolocation)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", modalities)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", contracts)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", movements)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", payments)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", holidays)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", images)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", roles)
      // console.log("🚀 ~ SeedService ~ cloneDatabase= ~ geolocation:", users)

      await Promise.all([
        this.geolocationModel.deleteMany(),
        this.modalityModel.deleteMany(),
        this.contractModel.deleteMany(),
        this.movementModel.deleteMany(),
        this.paymentModel.deleteMany(),
        this.holidayModel.deleteMany(),
        this.imageModel.deleteMany(),
        this.roleModel.deleteMany(),
        this.userModel.deleteMany(),
      ])
      await this.roleModel.insertMany(roles)
      await this.userModel.insertMany(users)
      await this.modalityModel.insertMany(modalities)
      await this.holidayModel.insertMany(holidays)
      await this.contractModel.insertMany(contracts)
      await this.movementModel.insertMany(movements)
      await this.paymentModel.insertMany(payments)
      await this.imageModel.insertMany(images)
      await this.geolocationModel.insertMany(geolocation)

      return 'Copia de seguridad realizada con éxito'

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
