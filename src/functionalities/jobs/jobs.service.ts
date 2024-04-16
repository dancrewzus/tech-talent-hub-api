import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { Image } from '../images/entities/image.entity'
import { User } from '../users/entities/user.entity';

@Injectable()
export class JobsService {

  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectModel(Image.name, 'backup') private readonly imageModelBackup: Model<Image>,
    @InjectModel(Role.name, 'backup') private readonly roleModelBackup: Model<Role>,
    @InjectModel(User.name, 'backup') private readonly userModelBackup: Model<User>,
    
    @InjectModel(Image.name, 'production') private readonly imageModelProduction: Model<Image>,
    @InjectModel(Role.name, 'production') private readonly roleModelProduction: Model<Role>,
    @InjectModel(User.name, 'production') private readonly userModelProduction: Model<User>,

    private readonly handleErrors: HandleErrors,
  ) { }

  // @Cron('10 1,13 * * *')
  async handleCron() {
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
        this.imageModelBackup.deleteMany(),
        this.roleModelBackup.deleteMany(),
        this.userModelBackup.deleteMany(),
      ])
      await this.roleModelBackup.insertMany(roles)
      await this.userModelBackup.insertMany(users)
      await this.imageModelBackup.insertMany(images)
      // this.logger.debug('Executed at 00:10am every day.')
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}