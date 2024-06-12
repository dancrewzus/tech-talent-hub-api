import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { Notification } from '../notifications/entities/notification.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { Image } from '../images/entities/image.entity'
import { User } from '../users/entities/user.entity';
import { Track } from '../tracks/entities/track.entity';

@Injectable()
export class JobsService {

  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectModel(Notification.name, 'backup') private readonly notificationModelBackup: Model<Notification>,
    @InjectModel(Track.name, 'backup') private readonly trackModelBackup: Model<Track>,
    @InjectModel(Image.name, 'backup') private readonly imageModelBackup: Model<Image>,
    @InjectModel(Role.name, 'backup') private readonly roleModelBackup: Model<Role>,
    @InjectModel(User.name, 'backup') private readonly userModelBackup: Model<User>,
    
    @InjectModel(Notification.name, 'production') private readonly notificationModelProduction: Model<Notification>,
    @InjectModel(Track.name, 'production') private readonly trackModelProduction: Model<Track>,
    @InjectModel(Image.name, 'production') private readonly imageModelProduction: Model<Image>,
    @InjectModel(Role.name, 'production') private readonly roleModelProduction: Model<Role>,
    @InjectModel(User.name, 'production') private readonly userModelProduction: Model<User>,

    private readonly handleErrors: HandleErrors,
  ) { }

  @Cron('10 1,13 * * *')
  async handleCron() {
    try {
      const [
        notifications,
        tracks,
        images,
        roles,
        users
      ] = await Promise.all([
        this.notificationModelBackup.find(),
        this.trackModelBackup.find(),
        this.imageModelProduction.find(),
        this.roleModelProduction.find(),
        this.userModelProduction.find(),
      ])

      await Promise.all([
        this.notificationModelBackup.deleteMany(),
        this.trackModelBackup.deleteMany(),
        this.imageModelBackup.deleteMany(),
        this.roleModelBackup.deleteMany(),
        this.userModelBackup.deleteMany(),
      ])

      await this.roleModelBackup.insertMany(roles)
      await this.userModelBackup.insertMany(users)
      await this.imageModelBackup.insertMany(images)
      await this.trackModelBackup.insertMany(tracks)
      await this.notificationModelBackup.insertMany(notifications)

      // const allData = [ ...notifications, ...tracks, ...images, ...users, ...roles ]
      // TODO: Send allData to a JSON file. backup_11-05-24-07:21:00

      // this.logger.debug('Executed at 01:10am an 01:10pm every day.')

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}