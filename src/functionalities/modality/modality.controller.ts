import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { User } from 'src/functionalities/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateModalityDto, CreateModalityDto } from './dto';
import { ModalitiesService } from './modality.service';
import { Modality } from './entities/modality.entity';

@Controller('modalities')
export class ModalitiesController {
  
  constructor(private readonly modalitiesService: ModalitiesService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'Modality created', type: Modality })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Body() createModalityDto: CreateModalityDto,
    @GetUser() user: User
  ) {
    return this.modalitiesService.create(createModalityDto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Modality found', type: Modality })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findAll() {
    return this.modalitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modalitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModalityDto: UpdateModalityDto) {
    return this.modalitiesService.update(id, updateModalityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modalitiesService.remove(id);
  }
}
