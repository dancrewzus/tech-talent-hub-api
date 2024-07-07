import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Ip } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {

  constructor(
    private readonly categoriesService: CategoriesService
  ) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'User created', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Ip() clientIp: string,
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User
  ) {
    return this.categoriesService.create(createCategoryDto, user, clientIp);
  }

  @Get()
  // @Auth()
  @ApiResponse({ status: 200, description: 'Users found', type: [User] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    return this.categoriesService.findCategories(paginationDto);
  }

  @Get(':search')
  @Auth()
  @ApiResponse({ status: 200, description: 'User found', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findOne(
    @Param('search') search: string
  ) {
    return this.categoriesService.findOne(search);
  }

  @Patch(':id')
  @Auth()
  @ApiResponse({ status: 200, description: 'User updated', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  update(
    @Ip() clientIp: string,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
    @GetUser() user: User
  ) {
    return this.categoriesService.update(id, updateCategoryDto, user, clientIp);
  }

  @Delete(':id')
  @Auth(ValidRoles.Root, ValidRoles.Administrator)
  @ApiResponse({ status: 200, description: 'User password reset.' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  remove(
    @Ip() clientIp: string,
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: User
  ) {
    return this.categoriesService.remove(id, user, clientIp);
  }
}
