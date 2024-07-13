import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "@nestjs/mongoose"
import { PaginateModel, Model, isValidObjectId, PaginateOptions } from "mongoose"

import { DayJSAdapter } from "src/common/adapters/dayjs.adapter"
import { HandleErrors } from "src/common/utils/handleErrors.util"
import { Category } from "../categories/entities/category.entity"
import { CreateOfferDto } from "./dto/create-offer.dto"
import { error } from 'src/common/constants/error-messages'
import { Track } from "../tracks/entities/track.entity"
import { Offer } from "./entities/offer.entity"
import { User } from "../users/entities/user.entity"
import { Utils } from "src/common/utils/utils"

@Injectable()
export class OffersService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Category.name, 'default') private readonly categoryModel: PaginateModel<Category>,
    @InjectModel(Offer.name, 'default') private readonly offerModel: PaginateModel<Offer>,
    @InjectModel(User.name, 'default') private readonly userModel: PaginateModel<User>,
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private formatReturnData = (offer: Offer, isAdmin: boolean) => {
    const { applies, ...restOfData } = offer
    return {
      applies: isAdmin ? applies : applies.length,
      ...restOfData
    }
  }

  /**
   * Determines the type of the given search parameter. This function checks if the search parameter is a valid
   * MongoDB ObjectId or a valid slug. It returns a corresponding type string.
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
   * Finds and retrieves an offer from the database based on the given search parameter, which can be either an ID
   * or a slug. This function first determines the type of the search parameter using the `searchType` method, then
   * queries the database accordingly. It also populates the `createdBy` field to include information about the creator
   * of the offer. If no offer is found, it throws a NotFoundException.
   *
   * @private
   * @async
   * @function findOffer
   * @param {string} search - The search parameter to find the offer, which can be an ID or a slug.
   * @returns {Promise<Offer>} A promise that resolves to the offer object if found, or rejects with an error
   *                           if the offer cannot be found or if an error occurs during the query.
   * @throws {NotFoundException} Throws this exception if no offer is found with the given search parameter.
   */
  private findOffer = async (search: string): Promise<Offer> => {
    try {
      let offer: Offer;
      const searchTypeResponse = this.searchType(search)
      switch (searchTypeResponse) {
        case 'id':
          offer = await this.offerModel.findById(search)
                  .populate('createdBy')
          break;
        case 'slug':
          offer = await this.offerModel.findOne({ slug: search.toLocaleLowerCase() })
                  .populate('createdBy')
          break;
        default:
          offer = null;
          break;
      }
      if(!offer) {
        throw new NotFoundException(`Offer with ${ searchTypeResponse } "${ search }" not found`)
      }
      return offer;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Creates a new offer in the database using the provided data. This function takes the offer data from
   * the CreateOfferDto, along with the user making the request and their IP address, to create a new offer.
   * It also logs the creation action in a tracking model for auditing purposes.
   *
   * @public
   * @async
   * @function create
   * @param {CreateOfferDto} createOfferDto - Data transfer object containing the details of the offer to be created.
   * @param {User} userRequest - The user object of the requester, used to set the `createdBy` field.
   * @param {string} clientIp - The IP address from which the creation request originated, used for logging purposes.
   * @returns {Promise<Offer>} A promise that resolves to the newly created offer object. If an error occurs,
   *                           it is caught and handled appropriately.
   * @throws Handles any exceptions that occur during the offer creation process and logs them.
   */
  public create = async (createOfferDto: CreateOfferDto, userRequest: User, clientIp: string): Promise<Offer> => {
    try {
      const { title, category, ...restOfData } = createOfferDto
      const categoryDb = await this.categoryModel.findById(category)
      if(!categoryDb) {
        throw new NotFoundException(`Category with id "${ category }" not found`)
      }
      const slug = this.utils.convertToSlug(title)
      const offer = await this.offerModel.create({
        title,
        slug,
        category: categoryDb._id,
        createdBy: userRequest.id,
        createdAt: this.dayjs.getCurrentDateTime(),
        updatedAt: this.dayjs.getCurrentDateTime(),
        ...restOfData
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `Offer ${ offer._id } was created.`,
        module: 'Offers',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return offer
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Retrieves a paginated list of offers from the database, with optional filtering. This function parses the
   * pagination and filtering parameters from the provided DTO, constructs a query to fetch the offers, and
   * includes related data such as the creator information. The response includes pagination metadata and the list
   * of offers.
   *
   * @public
   * @async
   * @function findOffers
   * @param {any} paginationDto - An object containing pagination parameters such as `limit`, `offset`, and an optional `filter` string,
   *                              or a JSON string that can be parsed into these parameters.
   * @returns {Promise<object>} A promise that resolves to an object containing pagination metadata and an array of offers.
   *                            The structure of the return is { data: { pagination: {}, offers: [] }}. If an error occurs,
   *                            it is caught and handled appropriately.
   * @throws {Error} Handles and logs any errors that occur during the execution.
   */
  public findOffers = async (paginationDto: any = {}, userRequest: User) => {
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
          },
          {
            path: 'applies'
          },
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
              title: new RegExp(filter, 'i'),
              deleted: false
            },
          ]
        }
      }
      const isAdmin = userRequest.role?.name !== 'client'
      const offers = await this.offerModel.paginate(data, options)
      return {
        data: {
          pagination: offers?.pagination || {},
          offers: offers?.docs.map((offer) => this.formatReturnData(offer, isAdmin)),
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  /**
   * Finds and retrieves a single offer based on the given search parameter, which can be either an ID or a slug.
   * This function delegates the actual lookup to the `findOffer` method and handles any errors that occur during
   * the process. If the offer is found, it is returned; otherwise, the error is caught and handled appropriately.
   *
   * @public
   * @async
   * @function findOne
   * @param {string} search - The search parameter used to find the offer, which can be an ID or a slug.
   * @returns {Promise<Offer>} A promise that resolves to the offer object if found. If an error occurs,
   *                           it is caught and handled, potentially resulting in the promise rejecting with an error.
   * @throws Handles any exceptions that occur during the offer lookup process and logs them.
   */
  public findOne = async (search: string): Promise<Offer> => {
    try {
      return this.findOffer(search)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  /**
   * Updates an offer's details in the database based on the provided ID and update data. The function first checks
   * if the offer exists. If found, it updates the offer's title, slug, and other details, sets the updated timestamp,
   * and saves the changes. Additionally, it logs the update action with relevant details for auditing purposes.
   *
   * @public
   * @async
   * @function update
   * @param {string} id - The ID of the offer to be updated.
   * @param {CreateOfferDto} updateOfferDto - The DTO containing the updated details for the offer.
   * @param {User} userRequest - The user object of the requester, used to log who performed the update.
   * @param {string} clientIp - The IP address from which the update request originated, used for logging purposes.
   * @returns {Promise<object>} A promise that resolves to the updated offer object. If an error occurs,
   *                            it is caught and handled appropriately.
   * @throws {NotFoundException} Throws this exception if no offer is found with the provided ID.
   * @throws Handles any exceptions that occur during the offer update process and logs them.
   */
  public update = async (id: string, updateOfferDto: CreateOfferDto, userRequest: User, clientIp: string): Promise<object> => {
    try {
      const offer = await this.offerModel.findById(id)
      if(!offer) {
        throw new NotFoundException(error.OFFER_NOT_FOUND)
      }
      const { title, description, salaryMin, salaryMax } = updateOfferDto
      const slug = this.utils.convertToSlug(title)
      Object.assign(offer, {
        ...updateOfferDto,
        slug,
        updatedAt: this.dayjs.getCurrentDateTime()
    })
      await offer.save()
      await this.trackModel.create({
        ip: clientIp,
        description: `Offer ${ offer._id } was updated: ${ JSON.stringify({ title, slug, description, salaryMin, salaryMax }) }.`,
        module: 'Offers',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return offer
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  /**
   * Soft deletes an offer by marking it as deleted in the database. This function sets the `deleted` flag
   * to true and updates the `updatedAt` and `deletedAt` timestamps. It also logs the action in a tracking model
   * for auditing purposes. If the offer is not found, a NotFoundException is thrown.
   *
   * @public
   * @async
   * @function remove
   * @param {string} id - The ID of the offer to be deleted.
   * @param {User} userRequest - The user object of the requester, used to log who performed the deletion.
   * @param {string} clientIp - The IP address from which the deletion request originated, used for logging purposes.
   * @returns {Promise<void>} A promise that resolves when the offer has been marked as deleted and the action logged.
   * @throws {NotFoundException} Throws this exception if no offer is found with the provided ID.
   * @throws Handles any exceptions that occur during the deletion process and logs them.
   */
  public remove = async (id: string, userRequest: User, clientIp: string) => {
    try {
      const offer = await this.offerModel.findById(id)
      if(!offer) {
        throw new NotFoundException(error.OFFER_NOT_FOUND)
      }
      // TODO. Si la oferta tiene postulaciones no debe eliminar
      await offer.updateOne({ 
        deleted: true,
        updatedAt: this.dayjs.getCurrentDateTime(),
        deletedAt: this.dayjs.getCurrentDateTime()
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `Offer ${ offer._id } was deactivated.`,
        module: 'Offers',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public applyToOffer = async (id: string, userRequest: User, clientIp: string) => {
    try {
      const offer = await this.offerModel.findById(id).populate('applies')
      if(!offer) {
        throw new NotFoundException(error.OFFER_NOT_FOUND)
      }

      const user = await this.userModel.findById(userRequest.id).populate('applies')
      if(!user) {
        throw new NotFoundException(error.USER_NOT_FOUND)
      }

      offer.applies.push(userRequest.id)
      await offer.save()

      user.applies.push(offer._id)
      await user.save()

      await this.trackModel.create({
        ip: clientIp,
        description: `User ${ userRequest.id } apply to offer ${ offer._id }.`,
        module: 'Offers',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}