import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

import { CreateUserDto } from 'src/functionalities/users/dto/create-user.dto'
import { Track } from 'src/functionalities/tracks/entities/track.entity'
import { LoginResponse } from './interfaces/login-response.interface'
import { Role } from 'src/functionalities/roles/entities/role.entity'
import { User } from 'src/functionalities/users/entities/user.entity'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { DayJSAdapter } from 'src/common/adapters/dayjs.adapter'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { error } from 'src/common/constants/error-messages'
import { Utils } from 'src/common/utils/utils'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    @InjectModel(Role.name, 'default') private readonly roleModel: Model<Role>,
    private readonly handleErrors: HandleErrors,
    private readonly jwtService: JwtService,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {}

  /**
    * Generates a JWT (JSON Web Token) using the provided payload and a specified expiration time.
    * This function is private and used within its class to create tokens that expire in 6 hours.
    * It leverages the jwtService's sign method for token creation.
    * 
    * @param payload - An object of type JwtPayload that contains the data to be encoded in the JWT.
    * @returns Returns a string representing the JWT.
    */
  private getJwtToken = (payload: JwtPayload) => this.jwtService.sign(payload, { expiresIn: '6h' })

  /**
    * Formats the user information into a structured object that includes both the JWT token and user data with additional formatting.
    * This function applies permissions based on the user's role and encapsulates user data such as name, email, and other personal identifiers
    * with proper formatting applied. It is designed to be private and utilized within its class for preparing user data for client-side consumption.
    *
    * @param user - An object of type User containing the user's details.
    * @returns Returns an object with a JWT token and formatted user data, including:
    *          - token: JWT token string created based on user's id and email.
    *          - user: An object containing:
    *            - permission: User's permissions determined by their role.
    *            - id: User's unique identifier.
    *            - email: User's email address.
    *            - fullname: User's full name, formatted with the first letter of each name capitalized.
    *            - name: User's first name, formatted with the first letter capitalized.
    *            - surname: User's last name, formatted with the first letter capitalized.
    *            - profilePicture: URL to the user's profile picture, if available.
    *            - phoneNumber: User's phone number, if available.
    *            - role: The name of the user's role.
    */
  private formatReturnData = (user: User): LoginResponse => {
    const permission: string = user.role 
      ? this.utils.getUserPermissions(user.role.name) 
      : ''
    return {
      token: this.getJwtToken({ id: `${ user.id }`, email: `${ user.email }` }),
      user: {
        permission,
        id: user.id,
        email: user.email,
        isLogged: user.isLogged || false,
        fullname: `${ this.utils.capitalizeFirstLetter(user.name) } ${ this.utils.capitalizeFirstLetter(user.surname) }` || '',
        name: this.utils.capitalizeFirstLetter(user.name) || '',
        surname: this.utils.capitalizeFirstLetter(user.surname) || '',
        profilePicture: user.profilePicture?.imageUrl || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role?.name || '',
        gender: user.gender || '',
      },
    }
  }

  /**
    * Asynchronously validates a plaintext password against a hashed password.
    * This function uses bcrypt to compare the provided plaintext password with the hashed password from the database.
    * It is designed to return a promise that resolves to a boolean indicating whether the password is valid.
    * 
    * @param plainPassword - The plaintext password to validate.
    * @param hashDb - The hashed password stored in the database.
    * @returns A Promise that resolves to a boolean value:
    *          - `true` if the plaintext password matches the hashed password.
    *          - `false` if there is a mismatch.
    *          The promise may reject with an error if the bcrypt comparison fails.
    */
  private validatePassword = async (plainPassword: string, hashDb: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(plainPassword, hashDb, (err, result) => {
        if(err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }

  /**
    * Authenticates a user by checking the provided email and password against the stored records.
    * It handles user lookup, password validation, and checks user's active status. If authentication succeeds,
    * it formats the return data for the client. If any step fails, it handles the error by throwing an appropriate
    * exception.
    * 
    * @param loginDto - A data transfer object containing the email and password submitted by the user.
    * @returns The formatted user data if authentication is successful. If any checks fail or an error occurs,
    *          it calls the error handling method to manage the exception.
    * @throws UnauthorizedException - Throws this exception if the credentials are invalid, the user does not exist,
    *                                the password does not match, or the user is not active.
    */
  public login = async (loginDto: LoginDto, clientIp: string): Promise<LoginResponse> => {
    try {
      const { password, email } = loginDto;
      const user = await this.userModel
        .findOne({ email: email.toLowerCase().trim() })
        .populate({ path: 'role', select: 'name' })
        .populate('profilePicture')
      const isValidPassword = await this.validatePassword(`${ password }`, `${ user?.password }`)
      if(!user || !isValidPassword) {
        throw new UnauthorizedException(error.INVALID_CREDENTIALS)
      }
      if(!user.isActive) {
        throw new UnauthorizedException(error.USER_INACTIVE)
      }
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } has logged in.`,
        module: 'Authentication',
        createdAt: this.dayjs.getCurrentDateTime(),
        user
      })
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
    * Resets the password for a user based on the provided email. This method first verifies if the user exists
    * and checks if the user account is active. If these conditions are met, it resets the user's password to a
    * hashed version of their email. This function handles all error conditions, including non-existent users
    * and inactive accounts, by throwing appropriate exceptions.
    * 
    * @param loginDto - A data transfer object containing the email of the user whose password needs to be reset.
    * @returns Nothing if the password reset is successful. In the case of any error, it calls the error handling
    *          method to manage the exception.
    * @throws UnauthorizedException - Throws this exception if no user is found with the provided email, or the
    *                                user is not active, indicating that the operation cannot proceed.
    */
  public resetPassword = async (loginDto: LoginDto, clientIp: string): Promise<LoginResponse> => {
    try {
      const { email } = loginDto;
      const user = await this.userModel
        .findOne({ email: email.toLowerCase().trim() })
      if(!user) {
        throw new UnauthorizedException(error.INVALID_CREDENTIALS)
      }
      if(!user.isActive) {
        throw new UnauthorizedException(error.USER_INACTIVE)
      }
      await this.userModel.updateOne(
        { _id: user.id },
        { password: bcrypt.hashSync(`${ this.utils.generatePassword() }`, 10) });
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } has reset password.`,
        module: 'Authentication',
        createdAt: this.dayjs.getCurrentDateTime(),
        user
      })
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  } 

  /**
    * Changes the password for a user based on the provided email and new password. The method verifies if the
    * user exists and if the account is active before proceeding with the password update. If the user is found
    * and active, the password is updated to a new hashed value. The function handles all error scenarios
    * appropriately, ensuring that the operation is secure and compliant with best practices.
    *
    * @param loginDto - A data transfer object containing the email of the user whose password needs to be changed
    *                   and the new password to be set.
    * @returns Nothing if the password change is successful. If any checks fail or an error occurs during the process,
    *          the error handling method manages the exception.
    * @throws UnauthorizedException - Throws this exception if no user is found with the provided email, if the user
    *                                is not active, or if any other error occurs, indicating that the password change
    *                                cannot proceed.
    */
  public changePassword = async (loginDto: LoginDto, clientIp: string): Promise<void> => {
    try {
      const { password, email } = loginDto;
      const user = await this.userModel
        .findOne({ email: email.toLowerCase().trim() })
      if(!user) {
        throw new UnauthorizedException(error.INVALID_CREDENTIALS)
      }
      if(!user.isActive) {
        throw new UnauthorizedException(error.USER_INACTIVE)
      }
      await this.userModel.updateOne(
        { _id: user.id },
        { password: bcrypt.hashSync(`${ password }`, 10) });
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } has changed password.`,
        module: 'Authentication',
        createdAt: this.dayjs.getCurrentDateTime(),
        user
      })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
    * Registers a new user in the database using the provided user data. This function takes care of extracting
    * the role and password from the provided data, validating the specified role or assigning a default primary role,
    * and finally creating the user with hashed password and other user data. If successful, it formats the returned
    * user data. The function handles potential errors related to role fetching and user creation appropriately.
    *
    * @param createUserDto - A data transfer object containing the user's desired role, password, and other relevant
    *                        user data necessary for account creation.
    * @returns The formatted user data upon successful registration. If an error occurs during the process,
    *          the error handling method manages the exception.
    * @throws NotFoundException - Throws this exception if the specified role or a primary role is not found,
    *                             indicating that the user cannot be registered without a valid role.
    */
  public register = async (createUserDto: CreateUserDto, clientIp: string): Promise<LoginResponse> => {
    try {
      const { role, password, ...userData } = createUserDto;
      let roleId = null;
      const roleById = await this.roleModel.findById(role);
      if (!roleById) {
        const primaryRole = await this.roleModel.findOne({ primary: true });
        if (!primaryRole) {
          throw new NotFoundException(error.ROLE_NOT_FOUND);
        }
        roleId = primaryRole.id;
      } else {
        roleId = roleById.id;
      }
      userData.email = userData.email.toLowerCase().trim();
      const user = await this.userModel.create({
        password: bcrypt.hashSync(`${ password }`, 10),
        role: roleId, 
        ...userData
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } has created.`,
        module: 'Authentication',
        createdAt: this.dayjs.getCurrentDateTime(),
        user
      })
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  /**
    * Checks and returns the authentication status of a user by formatting the user's data.
    * This function is designed to be a quick utility for retrieving formatted user data,
    * making it useful for endpoints that require user validation and data representation without
    * modifying any user state or performing additional checks.
    *
    * @param user - The user object whose authentication status is being checked.
    * @returns Formatted user data if the user is authenticated. In the case of an error,
    *          the error handling method manages the exception.
    * @throws The specific errors are not detailed here as they depend on the implementation of formatReturnData
    *         and handleExceptions, but generally, this could include any exceptions related to data formatting
    *         or handling.
    */
  public checkAuthStatus = async (user: User, clientIp: string): Promise<LoginResponse> => {
    try {
      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ user._id } has checked.`,
        module: 'Authentication',
        createdAt: this.dayjs.getCurrentDateTime(),
        user
      })
      return this.formatReturnData(user)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
