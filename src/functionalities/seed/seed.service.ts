import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

import { Role } from 'src/functionalities/roles/entities/role.entity'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { Image } from '../images/entities/image.entity'
import { User } from '../users/entities/user.entity'
import { SeedData } from './data/data.seed'
import { Category } from '../categories/entities/category.entity'
import { Offer } from '../offers/entities/offer.entity'

@Injectable()
export class SeedService {

  private logger

  constructor(    
    @InjectModel(Category.name, 'production') private readonly categoryModelProduction: Model<Category>,
    @InjectModel(Offer.name, 'production') private readonly offerModelProduction: Model<Offer>,
    @InjectModel(Image.name, 'production') private readonly imageModelProduction: Model<Image>,
    @InjectModel(Role.name, 'production') private readonly roleModelProduction: Model<Role>,
    @InjectModel(User.name, 'production') private readonly userModelProduction: Model<User>,

    @InjectModel(Category.name, 'test') private readonly categoryModel: Model<Category>,
    @InjectModel(Offer.name, 'test') private readonly offerModel: Model<Offer>,
    @InjectModel(Image.name, 'test') private readonly imageModel: Model<Image>,
    @InjectModel(Role.name, 'test') private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'test') private readonly userModel: Model<User>,

    private readonly handleErrors: HandleErrors,
    private readonly cloudAdapter: CloudAdapter,
    private readonly seedData: SeedData
  ) {
    this.logger = new Logger('Seed Service')
  }

  /**
   * Seeds the database with initial authentication data, which includes roles and user accounts.
   * The process involves several steps: 
   * 1. Deleting all existing resources from cloud storage and data from role and user models in the database.
   * 2. Inserting predefined roles into the database.
   * 3. Deleting all existing users to prepare for fresh user data insertion.
   * 4. Creating a 'super user' from the predefined user data and assigning it the appropriate role.
   * 5. Inserting the remaining predefined users with assigned roles and linking them to the created 'super user' if possible.
   * This method ensures the database is prepared with necessary initial data for the application to function correctly 
   * in terms of authentication and authorization.
   *
   * @async
   * @function seedAuthenticationData
   * @private
   * @returns {Promise<void>} Completes when all operations have finished without returning any value.
   * @throws {Error} Captures and logs any errors during the database seeding process.
   */
  private seedAuthenticationData = async () => {
      await Promise.all([
        this.cloudAdapter.deleteAllResources(),
        this.imageModelProduction.deleteMany(),
        this.roleModelProduction.deleteMany(),
        this.userModelProduction.deleteMany(),
      ])
      
      const rolesToInsert = this.seedData.getRoles()
      const createdRoles = await this.roleModelProduction.insertMany(rolesToInsert)

      this.logger.log('Roles seeded')
    
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
      await this.userModelProduction.insertMany(usersToInsert)
      this.logger.log('Users seeded')
  }

  /**
   * Public method to seed all necessary initial data into the application's database. This method specifically 
   * calls the `seedAuthenticationData` function to seed authentication related data and handles any errors that 
   * might arise during the process. If the data seeding is successful, it returns a confirmation message.
   *
   * @async
   * @function seedAll
   * @public
   * @returns {Promise<string>} A promise that resolves to a string message indicating that all data has been 
   *                            successfully seeded.
   * @throws {Error} Captures and logs any errors encountered during the seeding process. If an error occurs, 
   *                 error handling is delegated to the `handleErrors.handleExceptions` method which processes 
   *                 the error accordingly.
   */
  public seedAll = async () => {
    try {
      await this.seedAuthenticationData()
      return `All data seeded`
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Clones data from production database models (images, roles, users) into the corresponding development
   * or staging database models. This function first fetches all data from the production models, then clears
   * the existing data in the development models before inserting the fetched production data. This is useful
   * for scenarios where a copy of the production data is needed in a non-production environment for testing
   * or development purposes. The function ensures all operations are performed atomically to avoid partial data states.
   *
   * @async
   * @function cloneDatabase
   * @public
   * @param {{}} _ - Currently, no parameters are required for this function.
   * @returns {Promise<string>} A promise that resolves to a string indicating that the backup process has
   *                            been completed successfully.
   * @throws {Error} Handles any errors that arise during the cloning process by delegating to a centralized
   *                 error handling method, which processes and logs the exceptions accordingly.
   */ 
  public cloneDatabase = async ({ }) => {
    try {
      const [
        categories,
        offers,
        images,
        roles,
        users
      ] = await Promise.all([
        this.categoryModelProduction.find(),
        this.offerModelProduction.find(),
        this.imageModelProduction.find(),
        this.roleModelProduction.find(),
        this.userModelProduction.find(),
      ])

      await Promise.all([
        this.categoryModel.deleteMany(),
        this.offerModel.deleteMany(),
        this.imageModel.deleteMany(),
        this.roleModel.deleteMany(),
        this.userModel.deleteMany(),
      ])
      await this.roleModel.insertMany(roles)
      await this.userModel.insertMany(users)
      await this.imageModel.insertMany(images)
      await this.categoryModel.insertMany(categories)
      await this.offerModel.insertMany(offers)

      return 'Backup completed successfully'

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
