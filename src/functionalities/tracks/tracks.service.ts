import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PaginateModel, PaginateOptions } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { error } from 'src/common/constants/error-messages'
import { User } from '../users/entities/user.entity'
import { Track } from './entities/track.entity'

@Injectable()
export class TracksService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Track.name, 'default') private readonly trackModel: PaginateModel<Track>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  /**
   * Retrieves a paginated list of tracking records from the system, accessible only to users with administrative privileges.
   * The function first checks if the requesting user has the appropriate role. If not, it throws an UnauthorizedException.
   * It then parses pagination parameters and constructs a query based on optional search filters that can include IP addresses,
   * module names, or descriptions. This method leverages a MongoDB-based pagination mechanism to return a subset of tracking records
   * based on the provided criteria.
   *
   * @public
   * @async
   * @function findAll
   * @param {any} paginationDto - An object containing pagination parameters such as `limit`, `offset`, and a `filter` string,
   *                              or a JSON string that can be parsed into these parameters.
   * @param {User} userRequest - The user object of the requester, used to verify administrative privileges.
   * @returns {Promise<object>} A promise that resolves to an object containing pagination metadata and an array of track records.
   *                            The structure of the return is { data: { pagination: {}, tracks: [] }}. If an error occurs,
   *                            it is handled and logged appropriately.
   * @throws {UnauthorizedException} If the user does not have administrative privileges.
   */
  public findAll = async (paginationDto: any, userRequest: User) => {
    try {
      const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)
      if(!isAdmin) {
        throw new UnauthorizedException(error.TRACK_NOT_ACCESS)
      }
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
      let data: any = {}
      if(isSearch) {
        data = {
          $or: [
            { 
              ip: new RegExp(filter, 'i'),
            },
            { 
              module: new RegExp(filter, 'i'),
            },
            { 
              description: new RegExp(filter, 'i'),
            },
          ]
        }
      }    
      const tracks = await this.trackModel.paginate(data, options)
      return {
        data: {
          pagination: tracks?.pagination || {},
          tracks: tracks?.docs,
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
