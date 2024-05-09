/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model, PaginateModel, PaginateOptions, isValidObjectId } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { DayJSAdapter } from 'src/common/adapters/dayjs.adapter'
import { Notification } from './entities/notification.entity'
import { error } from 'src/common/constants/error-messages'
import { Track } from '../tracks/entities/track.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class NotificationsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Notification.name, 'default') private readonly notificationModel: PaginateModel<Notification>,
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  /**
   * Retrieves a specific notification by ID and checks if the requesting user is authorized to view it.
   * This function first searches for the notification by ID. If found, it then checks if the user requesting
   * the notification is either an administrator (root or admin) or the user associated with the notification.
   * If the user does not meet these criteria, an UnauthorizedException is thrown. This method ensures that
   * notifications are only accessible by users who have proper authorization, thereby maintaining data privacy and security.
   *
   * @public
   * @async
   * @function findOne
   * @param {string} id - The ID of the notification to be retrieved.
   * @param {User} userRequest - The user object of the requester, used to check access rights.
   * @returns {Promise<Notification>} A promise that resolves to the notification object if the user is authorized to view it.
   *                                  If no notification is found, or if the user is unauthorized, the appropriate exception is thrown.
   * @throws {NotFoundException} Throws this exception if no notification is found with the provided ID.
   * @throws {UnauthorizedException} Throws this exception if the user requesting the notification does not have the required
   *                                 authorization to view it.
   */
  public findOne = async (id: string, userRequest: User, clientIp: string): Promise<Notification> => {
    try {
      const notification = await this.notificationModel.findById(id)
      if(!notification) {
        throw new NotFoundException(error.NOTIFICATION_NOT_FOUND)
      }
      const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)
      if(!isAdmin && notification.user !== userRequest.id) {
        throw new UnauthorizedException(error.NOTIFICATION_NOT_ACCESS)
      }
      if(!isAdmin) {
        await notification.updateOne({
          isChecked: true,
          updatedAt: this.dayjs.getCurrentDateTime(),
        })
        await this.trackModel.create({
          ip: clientIp,
          description: `Notification ${ notification._id } was readed.`,
          module: 'Notifications',
          createdAt: this.dayjs.getCurrentDateTime(),
          user: userRequest.id
        })
      }
      return notification
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Retrieves a paginated list of notifications based on the provided pagination and filtering criteria.
   * Admin users can view notifications for all users, while non-admin users can only view notifications
   * associated with their own user ID. This function parses the pagination DTO to apply filtering, limit,
   * and offset parameters and constructs a query to fetch notifications accordingly. The response includes
   * pagination metadata and the list of notifications.
   *
   * @public
   * @async
   * @function findAll
   * @param {any} paginationDto - An object or JSON string containing pagination parameters (limit, offset) and a filter string.
   * @param {User} userRequest - The user object of the requester, used to determine if they have admin privileges.
   * @returns {Promise<object>} A promise that resolves to an object containing pagination metadata and an array of notifications.
   *                            The structure is { data: { pagination: {}, notifications: [] }}. If an error occurs, it is caught
   *                            and handled appropriately.
   * @throws {Error} Generic error handling is applied to catch and process any errors that arise during execution.
   */
  public findAll = async (paginationDto: any, userRequest: User): Promise<object> => {
    try {
      const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)
      const { limit, offset, filter } = paginationDto ? JSON.parse(paginationDto) : { limit: this.defaultLimit, offset: 0, filter: '' };
      const setOffset = offset === undefined ? 0 : offset
      const setLimit = limit === undefined ? this.defaultLimit : limit
      const isSearch = filter !== '' ? true : false
      const options: PaginateOptions = {
        offset: setOffset,
        limit: setLimit,
        sort: { createdAt: 1 },
        customLabels: {
          meta: 'pagination'
        }
      };
      let data: any = {
        user: isAdmin ? { $exists: true } : userRequest.id,
        deleted: false,
      }
      if(isSearch) {
        data = {
          $or: [
            { 
              title: new RegExp(filter, 'i'),
              user: isAdmin ? { $exists: true } : userRequest.id,
              deleted: false,
            },
            { 
              description: new RegExp(filter, 'i'),
              user: isAdmin ? { $exists: true } : userRequest.id,
              deleted: false,
            },
          ]
        }
      }    
      const notifications = await this.notificationModel.paginate(data, options)
      return {
        data: {
          pagination: notifications?.pagination || {},
          notifications: notifications?.docs,
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Soft deletes a notification by marking it as deleted in the database. This function first retrieves the notification
   * by its ID and checks if it exists. If the notification is not found, a NotFoundException is thrown. If the user
   * attempting to delete the notification is neither an admin nor the owner of the notification, an UnauthorizedException
   * is thrown. For non-admin users, the notification's 'deleted' status is set to true, and the 'deletedAt' timestamp
   * is updated. This method also logs the deletion action for auditing purposes.
   *
   * @public
   * @async
   * @function remove
   * @param {string} id - The ID of the notification to be deleted.
   * @param {User} userRequest - The user object of the requester, used to determine if they have the right to delete the notification.
   * @param {string} clientIp - The IP address from which the deletion request originated, used for logging purposes.
   * @returns {Promise<Notification>} A promise that resolves to the notification object marked as deleted, or rejects with an error
   *                                  if the operation is unauthorized or the notification cannot be found.
   * @throws {NotFoundException} - Throws this exception if no notification is found with the provided ID.
   * @throws {UnauthorizedException} - Throws this exception if the user does not have permission to delete the notification.
   */
  public remove = async (id: string, userRequest: User, clientIp: string): Promise<void> => {
    try {
      const notification = await this.notificationModel.findById(id)
      if(!notification) {
        throw new NotFoundException(error.NOTIFICATION_NOT_FOUND)
      }
      const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)
      if(!isAdmin && notification.user !== userRequest.id) {
        throw new UnauthorizedException(error.NOTIFICATION_NOT_ACCESS)
      }
      if(!isAdmin) {
        await notification.updateOne({
          deleted: true,
          updatedAt: this.dayjs.getCurrentDateTime(),
          deletedAt: this.dayjs.getCurrentDateTime(),
        })
        await this.trackModel.create({
          ip: clientIp,
          description: `Notification ${ notification._id } was deleted.`,
          module: 'Notifications',
          createdAt: this.dayjs.getCurrentDateTime(),
          user: userRequest.id
        })
      }
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
