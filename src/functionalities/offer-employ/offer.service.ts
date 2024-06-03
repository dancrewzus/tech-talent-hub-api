import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { HandleErrors } from 'src/common/utils/handleErrors.util'
import { DayJSAdapter } from 'src/common/adapters/dayjs.adapter'
import { ConfigService } from '@nestjs/config'

import { Offer } from './entities/offer.entity'
import { User } from '../users/entities/user.entity'
import { Track } from '../tracks/entities/track.entity'
import { CreateOfferDto } from './dto/create-offer.dto'
import { OfferReturnData } from './interfaces/offer-return-data.interface'

@Injectable()
export class OfferService {

    private defaultLimit: number;
    
    constructor(
        @InjectModel(Offer.name, 'default') private readonly offerModel: Model<Offer>,
        @InjectModel(User.name, 'default') private readonly userModel: PaginateModel<User>,
        @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
        private readonly configService: ConfigService,
        private readonly dayjs: DayJSAdapter,
        private readonly handleErrors: HandleErrors
    ) { 
        this.defaultLimit = this.configService.get<number>('defaultLimit')
    }

    /**
    * Returns an object containing the formatted offer data.
    *
    * @private
    * @function formatReturnData
    * @param {Offer} offer - The offer object to be formatted.
    * @returns {OfferReturnData} - An object containing the formatted offer data.
    */
    private formatReturnData(offer: Offer): OfferReturnData {
        return {
            id: offer._id,
            title: offer.title,
            position: offer.position,
            yearsOfExperience: offer.yearsOfExperience,
            contract: offer.contract,
            keywords: offer.keywords,
            salary: offer.salary,
            hiringDate: offer.hiringDate,
            status: offer.status
        }
    }

    /**
    * Creates a new offer in the database with specified data from CreateOfferDto, along with additional
    * audit and tracking information.
    *
    * @public
    * @async
    * @function create
    * @param {CreateOfferDto} createOfferDto - Data transfer object containing the new offer's data.
    * @param {User} userRequest - The user object of the requester, used to set the `createdBy` field.
    * @param {string} clientIp - IP address from which the request originated, used for logging purposes.
    * @returns {Promise<OfferReturnData>} A promise that resolves to the formatted offer data upon successful creation.
    */
    public create() = async (createOfferDto: CreateOfferDto, userRequest: User, clientIp: string): Promise<OfferReturnData> => {
        try {
            const offer =await this.offerModel.create({
                createdBy: userRequest.id,
                createdAt: this.dayjs.getCurrentDateTime(),
                updatedAt: this.dayjs.getCurrentDateTime(),
                ...createOfferDto
            })

            await this.trackModel.create({
                ip: clientIp,
                description: `Offer ${ offer._id } was created.`
                module: 'Offers',
                createAt: this.dayjs.getCurrentDateTime(),
                user: userRequest.id
            })
            return this.formatReturnData(offer)
        } catch (error) {
            this.handleErrors.handleExceptions(error)
        }
    }
}
