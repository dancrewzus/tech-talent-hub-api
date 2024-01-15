import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { User } from 'src/functionalities/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { UpdateHoliDayDto, CreateHoliDayDto } from './dto';
import { HolidaysService } from './holidays.service';
import { Holiday } from './entities/holiday.entity';

@Controller('holidays')
export class HolidaysController {
  
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'Holiday created', type: Holiday })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Body() createHolidayDto: CreateHoliDayDto,
    @GetUser() user: User
  ) {
    return this.holidaysService.create(createHolidayDto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Holiday found', type: Holiday })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findAll() {
    return this.holidaysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holidaysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdateHoliDayDto) {
    return this.holidaysService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidaysService.remove(id);
  }
}
