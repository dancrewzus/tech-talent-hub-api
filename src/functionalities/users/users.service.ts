import { Injectable, NotFoundException } from '@nestjs/common'
import { Model, PaginateModel, PaginateOptions, isValidObjectId } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'

import { UserReturnData } from './interfaces/user-return-data.interface'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { DayJSAdapter } from 'src/common/adapters/dayjs.adapter'
import { error } from 'src/common/constants/error-messages'
import { Image } from '../images/entities/image.entity'
import { Track } from '../tracks/entities/track.entity'
import { CreateUserDto, UpdateUserDto } from './dto'
import { Role } from '../roles/entities/role.entity'
import { Utils } from 'src/common/utils/utils'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {

  private defaultLimit: number;

  constructor(
    @InjectModel(User.name, 'default') private readonly userModel: PaginateModel<User>,
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    @InjectModel(Role.name, 'default') private readonly roleModel: Model<Role>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private populateRole = { path: 'role', select: 'name' }

  /**
   * Searches for and retrieves a user from the database based on the given search parameter. The search can be
   * by user ID or email. This function first determines the type of the search using the `searchType` method
   * and then queries the database accordingly. It populates related fields such as role, createdBy, and
   * profilePicture for the found user. If no user is found or the search type is invalid, it throws a
   * NotFoundException.
   *
   * @private
   * @async
   * @function findUser
   * @param {string} search - The search parameter, which can be an ID or an email address.
   * @returns {Promise<User>} A promise that resolves to the user object if found.
   * @throws {NotFoundException} Throws this exception if no user is found for the given search parameter or if
   *                             the search type is invalid, specifying what was searched and the search value.
   */
  private findUser = async (search: string): Promise<User> => {
    try {
      let user: User;
      const searchTypeResponse = this.searchType(search)
      switch (searchTypeResponse) {
        case 'id':
          user = await this.userModel.findById(search)
                  .populate(this.populateRole)
                  .populate('createdBy')
                  .populate('profilePicture')
          break;
        case 'email':
          user = await this.userModel.findOne({ email: search.toLocaleLowerCase() })
                  .populate(this.populateRole)
                  .populate('createdBy')
                  .populate('profilePicture')
          break;
        default:
          user = null;
          break;
      }
      if(!user) {
        throw new NotFoundException(`User with ${ searchTypeResponse } "${ search }" not found`)
      }
      return user
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Formats a user's data into a more structured and comprehensive object suitable for return in API responses.
   * This function checks if the user is active; if not, it terminates early. It also handles the assignment of
   * permissions based on the user's role and formats various user attributes such as names and email. If any 
   * data, such as the profile picture URL or phone number, is missing, it defaults to an empty string.
   *
   * @private
   * @function formatReturnData
   * @param {User} user - The user object to be formatted.
   * @returns {UserReturnData | undefined} Returns a structured object containing the formatted user data, 
   *          or undefined if the user is not active.
   */
  private formatReturnData = (user: User): UserReturnData => {
    if(!user.isActive) return
    const permission: string = user.role 
      ? this.utils.getUserPermissions(user.role.name) 
      : ''
    return {
      permission,
      id: user.id,
      email: user.email,
      fullname: `${ this.utils.capitalizeFirstLetter(user.name) } ${ this.utils.capitalizeFirstLetter(user.surname) }` || '',
      name: this.utils.capitalizeFirstLetter(user.name) || '',
      surname: this.utils.capitalizeFirstLetter(user.surname) || '',
      profilePicture: user.profilePicture?.imageUrl || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role?.name || '',
    }
  }

  /**
 * Determines the type of the provided search query by checking if the input is a valid MongoDB ObjectId,
 * a valid email address, or otherwise categorizes it as invalid. This function aids in categorizing user
 * input for further processing based on its validity and type, enhancing search functionalities by
 * directing queries to the appropriate processing logic.
 *
 * @private
 * @function searchType
 * @param {string | number} search - The search query input which can either be an ID or an email.
 * @returns {string} Returns 'id' if the input is a valid MongoDB ObjectId, 'email' if the input is a valid
 *                   email address, or 'invalid' if neither condition is met.
 */
  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) {
      return 'id'
    }
    if(this.utils.validateEmail(`${ search }`)) {
      return 'email'
    }
    return 'invalid'
  }
  
  /**
   * Creates a new user in the database with specified data from CreateUserDto, along with additional
   * audit and tracking information. This method handles validations for role and profile picture,
   * ensures data integrity, and logs the creation event. It also sets initial points based on the role
   * and hashes the password for security.
   *
   * @public
   * @async
   * @function create
   * @param {CreateUserDto} createUserDto - Data transfer object containing the new user's data.
   * @param {string} clientIp - IP address from which the request originated, used for logging purposes.
   * @returns {Promise<UserReturnData>} A promise that resolves to the formatted user data upon successful creation.
   * @throws {NotFoundException} Throws this exception if the specified role or profile picture does not exist.
   */
  public create = async (createUserDto: CreateUserDto, clientIp: string): Promise<UserReturnData> => {
    try {
      const { role, password, email, profilePicture, ...data } = createUserDto;
      const databaseRole = await this.roleModel.findOne({ name: role as string || 'client' as string })
      if(!databaseRole) {
        throw new NotFoundException(`Role with id or name "${ role }" not found`)
      }
      let databaseProfilePicture = null
      if(profilePicture !== '') {
        databaseProfilePicture = await this.imageModel.findOne({ _id : profilePicture })
        if(!databaseProfilePicture) {
          throw new NotFoundException(`Image with id "${ profilePicture }" not found`)
        }
      }
      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password ? password : email }`, 10),
        role: databaseRole.id,
        profilePicture: databaseProfilePicture?.id || null,
        email,
        createdAt: this.dayjs.getCurrentDateTime(),
        updatedAt: this.dayjs.getCurrentDateTime(),
        ...data
      });
      user.role = databaseRole
      user.profilePicture = databaseProfilePicture
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } was created.`,
        module: 'Users',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: user.id
      })
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  /**
   * Retrieves users based on a specified role and optional filter criteria. This function first verifies the existence
   * of the specified role. It then parses pagination details and filter criteria from the provided DTO to construct
   * a query. If a filter is provided, it performs a case-insensitive search across multiple user fields. The function
   * utilizes the pagination options to fetch a subset of users and returns them along with pagination metadata.
   *
   * @public
   * @async
   * @function findUsers
   * @param {any} paginationDto - The pagination and filter criteria in JSON string format, which includes `limit`,
   *                              `offset`, and `filter` properties.
   * @param {string} role - The name of the role to filter users by. Only users with this role will be considered.
   * @returns {Promise<object>} A promise that resolves to an object containing pagination metadata and an array of
   *                            formatted user data. If the role is not found or an error occurs during the database
   *                            operation, an exception is thrown.
   * @throws {NotFoundException} - Throws if the specified role is not found in the database.
   */
  public findUsers = async (paginationDto: any, role: string) => {
    const databaseRole = await this.roleModel.findOne({ name: role as string })
    if(!databaseRole) {
      throw new NotFoundException(`Role with name ${ role } not found`)
    }
    const { limit, offset, filter } = paginationDto ? JSON.parse(paginationDto) : { limit: this.defaultLimit, offset: 0, filter: '' };
    const setOffset = offset === undefined ? 0 : offset
    const setLimit = limit === undefined ? this.defaultLimit : limit
    const isSearch = filter !== '' ? true : false
    try {
      const options: PaginateOptions = {
        offset: setOffset,
        limit: setLimit,
        populate: [
          { 
            path: 'role', select: 'name'
          },
          {
            path: 'createdBy profilePicture'
          }
        ],
        sort: { createdAt: 1 },
        customLabels: {
          meta: 'pagination'
        }
      };        
      let data: any = {
        role: databaseRole.id,
        isActive: true
      }
      if(isSearch) {
        data = {
          $or: [
            { 
              email: new RegExp(filter, 'i'),
              role: databaseRole.id,
              isActive: true
            },
            { 
              name: new RegExp(filter, 'i'),
              role: databaseRole.id,
              isActive: true
            },
            {
              surname: new RegExp(filter, 'i'),
              role: databaseRole.id,
              isActive: true
            },
            {
              phoneNumber: new RegExp(filter, 'i'),
              role: databaseRole.id,
              isActive: true
            },
          ]
        }
      }
      const clients = await this.userModel.paginate(data, options)
      return {
        data: {
          pagination: clients?.pagination || {},
          clients: clients?.docs.map((client) => this.formatReturnData(client)),
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Retrieves a single user based on a search parameter that can either be a user ID or an email address.
   * The function first determines the type of the search parameter using `searchType`. Depending on the
   * response from `searchType`, it either fetches the user by ID or by email. If no user is found, or if
   * the search parameter does not match any expected formats, it throws a NotFoundException.
   *
   * @public
   * @async
   * @function findOne
   * @param {string} search - The search parameter, which can be a user ID or an email address.
   * @returns {Promise<UserReturnData>} A promise that resolves to the formatted user data if the user is found.
   *                                    Throws a NotFoundException if no user is found or if the search type is invalid.
   * @throws {NotFoundException} Throws this exception if no user is found for the given search parameter or if
   *                             the search type is not recognized.
   */
  public findOne = async (search: string): Promise<UserReturnData> => {
    try {
      const user = await this.findUser(search)
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Checks if a client exists in the database by a given search string, which can be an ID or an email.
   * This function uses the `searchType` helper method to determine the nature of the search parameter
   * and then attempts to fetch the user accordingly. It returns an object indicating whether the user
   * exists in the database.
   *
   * @public
   * @async
   * @function clientExist
   * @param {string} search - The search parameter to identify the user, which could be an ID or an email address.
   * @returns {Promise<{exist: boolean}>} A promise that resolves to an object containing a boolean 'exist' field,
   *          which is true if the user exists and false otherwise.
   * @throws Handles any internal errors that occur during the process and throws them after logging.
   */
  public clientExist = async (search: string): Promise<{ exist: boolean }> => {
    try {
      const user = await this.findUser(search)
      return { exist: user ? true : false }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Updates specific fields of a user's profile based on the provided data transfer object (DTO). The function first
   * retrieves the user by the specified ID. If the user exists, it applies the updates and records the action, including
   * the IP address from which the request was made and the user who made the request, in a tracking model. This method
   * ensures that the update actions are traceable and that the data is kept current.
   *
   * @public
   * @async
   * @function update
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The DTO containing the fields to update.
   * @param {User} userRequest - The user requesting the update, used for logging purposes.
   * @param {string} clientIp - The IP address from which the update request originated, used for logging.
   * @returns {Promise<object>} A promise that resolves to an object containing the updated user data. If an error occurs,
   *                             the promise rejects with an appropriate error message.
   * @throws {NotFoundException} Throws this exception if no user is found for the given ID.
   */
  public update = async (id: string, updateUserDto: UpdateUserDto, userRequest: User, clientIp: string): Promise<object> => {
    try {
      const user = await this.userModel.findById(id)
      if(!user) {
        throw new NotFoundException(error.USER_NOT_FOUND)
      }
      await user.updateOne({
        ...updateUserDto,
        updatedAt: this.dayjs.getCurrentDateTime(),
      })
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } was updated: ${ JSON.stringify(updateUserDto) }.`,
        module: 'Users',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return { ...user.toJSON(), ...updateUserDto }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Resets the password of a specified user to a new value based on their email address. The new password
   * is hashed for security. The function first retrieves the user by their ID, then updates the user's
   * password and sets the 'isLogged' status to false. Additionally, this method logs the password reset
   * action in a tracking model with details about the action and the requester's information.
   *
   * @public
   * @async
   * @function resetPassword
   * @param {string} id - The ID of the user whose password is to be reset.
   * @param {User} userRequest - The user object of the requester, used for logging who initiated the reset.
   * @param {string} clientIp - The IP address from which the reset request originated, used for logging purposes.
   * @returns {Promise<void>} A promise that resolves when the password reset process is complete. The function
   *                          does not return any value but completes the password reset and logs the event.
   * @throws {NotFoundException} - Throws this exception if no user is found for the provided ID.
   */
  public resetPassword = async (id: string, userRequest: User, clientIp: string) => {
    try {
      const user = await this.userModel.findById(id)
      if(!user) {
        throw new NotFoundException(error.USER_NOT_FOUND)
      }
      await user.updateOne({ 
        password: bcrypt.hashSync(`${ user.email.toLowerCase().trim() }`, 10),
        updatedAt: this.dayjs.getCurrentDateTime(),
        isLogged: false,
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } was reset password.`,
        module: 'Users',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Deactivates a user account by setting its `isActive` flag to false, effectively disabling the user from logging in
   * or being considered active without actually removing their data from the database. The function first retrieves
   * the user by ID. If the user is found, their `isActive` status is updated. This deactivation is logged in a tracking
   * model with details including who initiated the deactivation and from what IP address. This method ensures that the
   * user data is retained for audit and compliance purposes while disabling the user account.
   *
   * @public
   * @async
   * @function remove
   * @param {string} id - The ID of the user to be deactivated.
   * @param {User} userRequest - The user object of the requester, used for logging who initiated the deactivation.
   * @param {string} clientIp - The IP address from which the deactivation request originated, used for logging purposes.
   * @returns {Promise<void>} A promise that resolves when the user deactivation process is complete. The function
   *                          does not return any value but completes the deactivation and logs the event.
   * @throws {NotFoundException} - Throws this exception if no user is found for the provided ID.
   */
  public remove = async (id: string, userRequest: User, clientIp: string) => {
    try {
      const user = await this.userModel.findById(id)
      if(!user) {
        throw new NotFoundException(error.USER_NOT_FOUND)
      }
      await user.updateOne({ 
        isActive: false,
        updatedAt: this.dayjs.getCurrentDateTime(),
        deletedAt: this.dayjs.getCurrentDateTime()
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } was deactivated.`,
        module: 'Users',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
