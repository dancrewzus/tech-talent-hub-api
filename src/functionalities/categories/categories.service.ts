import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "@nestjs/mongoose"
import { PaginateModel, Model, isValidObjectId, PaginateOptions } from "mongoose"

import { DayJSAdapter } from "src/common/adapters/dayjs.adapter"
import { HandleErrors } from "src/common/utils/handleErrors.util"
import { CreateCategoryDto } from "./dto/create-category.dto"
import { error } from 'src/common/constants/error-messages'
import { Track } from "../tracks/entities/track.entity"
import { Category } from "./entities/category.entity"
import { User } from "../users/entities/user.entity"
import { Utils } from "src/common/utils/utils"

@Injectable()
export class CategoriesService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Category.name, 'default') private readonly categoryModel: PaginateModel<Category>,
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  /**
   * Determines the type of the given search parameter. This function checks if the search parameter is a valid
   * MongoDB ObjectId, a valid slug, or neither. It helps in categorizing the search input for appropriate handling
   * in the application.
   *
   * @private
   * @function searchType
   * @param {string | number} search - The search parameter to be evaluated, which can be either a string or a number.
   * @returns {string} Returns 'id' if the search parameter is a valid MongoDB ObjectId, 'slug' if it matches the slug
   *                   pattern, or 'invalid' if it matches neither criteria.
   */
  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) {
      return 'id'
    }
    if(this.utils.isValidSlug(`${ search }`)) {
      return 'slug'
    }
    return 'invalid'
  }

  /**
   * Finds and retrieves a category from the database based on the given search parameter, which can be either an ID
   * or an slug. This function first determines the type of the search parameter using the `searchType` method, then
   * queries the database accordingly. It also populates the `createdBy` field to include information about the creator
   * of the category. If no category is found, it throws a NotFoundException.
   *
   * @private
   * @async
   * @function findCategory
   * @param {string} search - The search parameter to find the category, which can be an ID or an slug.
   * @returns {Promise<Category>} A promise that resolves to the category object if found, or rejects with an error
   *                              if the category cannot be found or if an error occurs during the query.
   * @throws {NotFoundException} Throws this exception if no category is found with the given search parameter.
   */
  private findCategory = async (search: string): Promise<Category> => {
    try {
      let category: Category;
      const searchTypeResponse = this.searchType(search)
      switch (searchTypeResponse) {
        case 'id':
          category = await this.categoryModel.findById(search)
                  .populate('createdBy')
          break;
        case 'slug':
          category = await this.categoryModel.findOne({ slug: search.toLocaleLowerCase() })
                  .populate('createdBy')
          break;
        default:
          category = null;
          break;
      }
      if(!category) {
        throw new NotFoundException(`Category with ${ searchTypeResponse } "${ search }" not found`)
      }
      return category;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Creates a new category in the database using the provided data. This function takes the category data from
   * the CreateCategoryDto, along with the user making the request and their IP address, to create a new category.
   * It also logs the creation action in a tracking model for auditing purposes.
   *
   * @public
   * @async
   * @function create
   * @param {CreateCategoryDto} createCategoryDto - Data transfer object containing the details of the category to be created.
   * @param {User} userRequest - The user object of the requester, used to set the `createdBy` field.
   * @param {string} clientIp - The IP address from which the creation request originated, used for logging purposes.
   * @returns {Promise<Category>} A promise that resolves to the newly created category object. If an error occurs,
   *                              it is caught and handled appropriately.
   * @throws Handles any exceptions that occur during the category creation process and logs them.
   */
  public create = async (createCategoryDto: CreateCategoryDto, userRequest: User, clientIp: string): Promise<Category> => {
    try {
      const { name } = createCategoryDto
      const slug = this.utils.convertToSlug(name)
      const category = await this.categoryModel.create({
        name,
        slug,
        createdBy: userRequest.id,
        createdAt: this.dayjs.getCurrentDateTime(),
        updatedAt: this.dayjs.getCurrentDateTime(),
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `Category ${ category._id } was created.`,
        module: 'Categories',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return category
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Retrieves a paginated list of categories from the database, with optional filtering. This function parses the
   * pagination and filtering parameters from the provided DTO, constructs a query to fetch the categories, and
   * includes related data such as the creator information. The response includes pagination metadata and the list
   * of categories.
   *
   * @public
   * @async
   * @function findCategories
   * @param {any} paginationDto - An object containing pagination parameters such as `limit`, `offset`, and an optional `filter` string,
   *                              or a JSON string that can be parsed into these parameters.
   * @returns {Promise<object>} A promise that resolves to an object containing pagination metadata and an array of categories.
   *                            The structure of the return is { data: { pagination: {}, categories: [] }}. If an error occurs,
   *                            it is caught and handled appropriately.
   * @throws {Error} Handles and logs any errors that occur during the execution.
   */
  public findCategories = async (paginationDto: any = {}) => {
    const isEmptyPagination = paginationDto && paginationDto !== 'null' ? Object.keys(paginationDto).length === 0 : true
    const { limit, offset, filter } = !isEmptyPagination ? JSON.parse(paginationDto) : { limit: this.defaultLimit, offset: 0, filter: '' };
    const setOffset = offset === undefined ? 0 : offset
    const setLimit = limit === undefined ? this.defaultLimit : limit
    const isSearch = filter !== '' ? true : false
    try {
      const options: PaginateOptions = {
        offset: setOffset,
        limit: setLimit,
        populate: [
          {
            path: 'createdBy'
          }
        ],
        sort: { createdAt: 1 },
        customLabels: {
          meta: 'pagination'
        }
      };        
      let data: any = {
        deleted: false
      }
      if(isSearch) {
        data = {
          $or: [
            { 
              slug: new RegExp(filter, 'i'),
              deleted: false
            },
            { 
              name: new RegExp(filter, 'i'),
              deleted: false
            },
          ]
        }
      }
      const categories = await this.categoryModel.paginate(data, options)
      return {
        data: {
          pagination: categories?.pagination || {},
          categories: categories?.docs.map((cat) => cat),
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Finds and retrieves a single category based on the given search parameter, which can be either an ID or a slug.
   * This function delegates the actual lookup to the `findCategory` method and handles any errors that occur during
   * the process. If the category is found, it is returned; otherwise, the error is caught and handled appropriately.
   *
   * @public
   * @async
   * @function findOne
   * @param {string} search - The search parameter used to find the category, which can be an ID or a slug.
   * @returns {Promise<Category>} A promise that resolves to the category object if found. If an error occurs,
   *                              it is caught and handled, potentially resulting in the promise rejecting with an error.
   * @throws Handles any exceptions that occur during the category lookup process and logs them.
   */
  public findOne = async (search: string): Promise<Category> => {
    try {
      return this.findCategory(search)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Updates a category's details in the database based on the provided ID and update data. The function first checks
   * if the category exists. If found, it updates the category's name and slug, sets the updated timestamp, and saves
   * the changes. Additionally, it logs the update action with relevant details for auditing purposes.
   *
   * @public
   * @async
   * @function update
   * @param {string} id - The ID of the category to be updated.
   * @param {CreateCategoryDto} updateCategoryDto - The DTO containing the updated name for the category.
   * @param {User} userRequest - The user object of the requester, used to log who performed the update.
   * @param {string} clientIp - The IP address from which the update request originated, used for logging purposes.
   * @returns {Promise<object>} A promise that resolves to the updated category object. If an error occurs,
   *                            it is caught and handled appropriately.
   * @throws {NotFoundException} Throws this exception if no category is found with the provided ID.
   * @throws Handles any exceptions that occur during the category update process and logs them.
   */
  public update = async (id: string, updateCategoryDto: CreateCategoryDto, userRequest: User, clientIp: string): Promise<object> => {
    try {
      const category = await this.categoryModel.findById(id)
      if(!category) {
        throw new NotFoundException(error.CATEGORY_NOT_FOUND)
      }
      const { name } = updateCategoryDto
      const slug = this.utils.convertToSlug(name)
      category.name = name
      category.slug = slug
      category.updatedAt = this.dayjs.getCurrentDateTime()
      await category.save()
      await this.trackModel.create({
        ip: clientIp,
        description: `Category ${ category._id } was updated: ${ JSON.stringify({ name, slug }) }.`,
        module: 'Categories',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return category
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Soft deletes a category by marking it as deleted in the database. This function sets the `deleted` flag
   * to true and updates the `updatedAt` and `deletedAt` timestamps. It also logs the action in a tracking model
   * for auditing purposes. If the category is not found, a NotFoundException is thrown.
   *
   * @public
   * @async
   * @function remove
   * @param {string} id - The ID of the category to be deleted.
   * @param {User} userRequest - The user object of the requester, used to log who performed the deletion.
   * @param {string} clientIp - The IP address from which the deletion request originated, used for logging purposes.
   * @returns {Promise<void>} A promise that resolves when the category has been marked as deleted and the action logged.
   * @throws {NotFoundException} Throws this exception if no category is found with the provided ID.
   * @throws Handles any exceptions that occur during the deletion process and logs them.
   */
  public remove = async (id: string, userRequest: User, clientIp: string) => {
    try {
      const category = await this.categoryModel.findById(id)
      if(!category) {
        throw new NotFoundException(error.CATEGORY_NOT_FOUND)
      }
      await category.updateOne({ 
        deleted: true,
        updatedAt: this.dayjs.getCurrentDateTime(),
        deletedAt: this.dayjs.getCurrentDateTime()
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `Category ${ category._id } was deactivated.`,
        module: 'Categories',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}