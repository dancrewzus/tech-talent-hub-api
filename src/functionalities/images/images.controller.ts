import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
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
  
  @Get()
  @Auth(ValidRoles.Root)
  @ApiResponse({ status: 200, description: 'Image list', type: [Image] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  findAll(
    @Query('pagination') paginationDto: PaginationDto
  ) {
    return this.imageService.findAll(paginationDto)
  }

  @Get(':search')
  @Auth()
  @ApiResponse({ status: 200, description: 'Image found', type: Image })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findOne(
    @Param('search') search: string
  ) {
    return this.imageService.findOne(search)
  }
  
  @Delete(':id')
  @Auth(ValidRoles.Root, ValidRoles.Administrator, ValidRoles.Athlete)
  @ApiResponse({ status: 200, description: 'Image deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  remove(
    @Param('id', ParseMongoIdPipe) id: string
  ) {
    return this.imageService.remove(id)
  }
}
