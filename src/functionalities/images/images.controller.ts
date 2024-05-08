import { Controller, Post, Body, HttpCode } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from '../users/entities/user.entity' 
import { Image } from './entities/image.entity' 

import { CreateImageDto } from './dto/create-image.dto'
import { ImagesService } from './images.service'

@ApiTags('Images')
@Controller('images')
@Auth()
export class ImagesController {

  constructor(private readonly imageService: ImagesService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'Image created', type: Image })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Body() createImageDto: CreateImageDto,
    @GetUser() user: User
  ) {
    return this.imageService.create(createImageDto, user)
  }
}
