import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

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
  @ApiResponse({ status: 200, description: 'Users found', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findAll(
    @Query('pagination') paginationDto: PaginationDto,
    @Query('type') type: string
  ) {
    return this.usersService.findUsers(paginationDto, type);
  }
  
  @Get('clients')
  @Auth()
  @ApiResponse({ status: 200, description: 'Clients found', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findClients(
    @Query('pagination') paginationDto: PaginationDto
  ) {
    return this.usersService.findClients(paginationDto);
  }

  @Get(':search')
  @Auth()
  findOne(@Param('search') search: string) {
    return this.usersService.findOne(search);
  }

  @Patch(':search')
  @Auth()
  update(@Param('search') search: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(search, updateUserDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
