/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

/**
 * DATE MANAGEMENT
 */

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Caracas')

// END DATE MANAGEMENT

import { HandleErrors } from 'src/common/utils/handleErrors.util';

import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { Notification } from './entities/notification.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Notification.name, 'default') private readonly notificationModel: Model<Notification>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  findAll(paginationDto: any, search: string, userRequest: User) {
    return `This action returns all notifications`;
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto, userRequest: User) {
    return `This action updates a #${id} notification`;
  }

  remove(id: string, userRequest: User) {
    return `This action removes a #${id} notification`;
  }
}
