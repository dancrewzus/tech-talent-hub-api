import { Controller, Post, Body, HttpCode, Ip } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { OfferService } from './offer.service'
import { Offer } from './entities/offer.entity'
import { CreateOfferDto } from './dto/create-offer.dto'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from '../users/entities/user.entity'

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
    constructor(private offerService: OfferService) {}

    @Post()
    @HttpCode(201)
    @Auth()
    @ApiResponse({ status: 201, description: 'Offer created', type: Offer })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 422, description: 'Unprocessable entity' })
    @ApiResponse({ status: 500, description: 'Internal error' })
    create(
        @Ip() clientIp: string,
        @Body() createOfferDto: CreateOfferDto,
        @GetUser() user: User
    ) {
        return this.offerService.create(createOfferDto, user, clientIp)
    }
}
