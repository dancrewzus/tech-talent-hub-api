import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { UserDataService } from './user-data.service';

@Controller('user-data')
export class UserDataController {

  constructor(
    private readonly userDataService: UserDataService
  ) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userDataService.findAll(paginationDto);
  }

  @Get(':search')
  findOne(@Param('search') search: String) {
    return this.userDataService.findOne(search);
  }

  @Patch(':search')
  update(@Param('search') search: String, @Body() updateUserDataDto: UpdateUserDataDto) {
    return this.userDataService.update(search, updateUserDataDto);
  }
}
