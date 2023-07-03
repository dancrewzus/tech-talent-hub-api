import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':search')
  @Auth()
  findOne(@Param('search') search: String) {
    return this.usersService.findOne(search);
  }

  @Patch(':search')
  @Auth()
  update(@Param('search') search: String, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(search, updateUserDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseMongoIdPipe) id: String) {
    return this.usersService.remove(id);
  }
}
