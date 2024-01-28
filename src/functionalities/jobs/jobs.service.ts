import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { Geolocation } from '../movements/entities/location.entity'
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { Contract } from '../contracts/entities/contracts.entity'
import { Movement } from '../movements/entities/movement.entity'
import { Holiday } from '../holidays/entities/holiday.entity'
import { Modality } from '../modality/entities/modality.entity'
import { Payment } from '../payments/entities/payment.entity'
import { Image } from '../images/entities/image.entity'
import { User } from '../users/entities/user.entity';

@Injectable()
export class JobsService {

  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectModel(Geolocation.name, 'backup') private readonly geolocationModelBackup: Model<Geolocation>,
    @InjectModel(Contract.name, 'backup') private readonly contractModelBackup: Model<Contract>,
    @InjectModel(Movement.name, 'backup') private readonly movementModelBackup: Model<Movement>,
    @InjectModel(Payment.name, 'backup') private readonly paymentModelBackup: Model<Payment>,
    @InjectModel(Image.name, 'backup') private readonly imageModelBackup: Model<Image>,
    @InjectModel(Role.name, 'backup') private readonly roleModelBackup: Model<Role>,
    @InjectModel(User.name, 'backup') private readonly userModelBackup: Model<User>,
    @InjectModel(Modality.name, 'backup') private readonly modalityModelBackup: Model<Modality>,
    @InjectModel(Holiday.name, 'backup') private readonly holidayModelBackup: Model<Holiday>,
    
    @InjectModel(Geolocation.name, 'production') private readonly geolocationModelProduction: Model<Geolocation>,
    @InjectModel(Contract.name, 'production') private readonly contractModelProduction: Model<Contract>,
    @InjectModel(Movement.name, 'production') private readonly movementModelProduction: Model<Movement>,
    @InjectModel(Payment.name, 'production') private readonly paymentModelProduction: Model<Payment>,
    @InjectModel(Image.name, 'production') private readonly imageModelProduction: Model<Image>,
    @InjectModel(Role.name, 'production') private readonly roleModelProduction: Model<Role>,
    @InjectModel(User.name, 'production') private readonly userModelProduction: Model<User>,
    @InjectModel(Modality.name, 'production') private readonly modalityModelProduction: Model<Modality>,
    @InjectModel(Holiday.name, 'production') private readonly holidayModelProduction: Model<Holiday>,

    private readonly handleErrors: HandleErrors,
  ) { }

  @Cron('10 0 * * *')
  // @Cron('45 * * * * *')
  // @Timeout(5000)
  async handleCron() {
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

      await Promise.all([
        this.geolocationModelBackup.deleteMany(),
        this.modalityModelBackup.deleteMany(),
        this.contractModelBackup.deleteMany(),
        this.movementModelBackup.deleteMany(),
        this.paymentModelBackup.deleteMany(),
        this.holidayModelBackup.deleteMany(),
        this.imageModelBackup.deleteMany(),
        this.roleModelBackup.deleteMany(),
        this.userModelBackup.deleteMany(),
      ])
      await this.roleModelBackup.insertMany(roles)
      await this.userModelBackup.insertMany(users)
      await this.modalityModelBackup.insertMany(modalities)
      await this.holidayModelBackup.insertMany(holidays)
      await this.contractModelBackup.insertMany(contracts)
      await this.movementModelBackup.insertMany(movements)
      await this.paymentModelBackup.insertMany(payments)
      await this.imageModelBackup.insertMany(images)
      await this.geolocationModelBackup.insertMany(geolocation)
      this.logger.debug('Executed at 00:10am every day.')
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}