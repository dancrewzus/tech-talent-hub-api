import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User
  ) {
    return this.usersService.create(createUserDto, user);
  }

  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Password changed.' })
  @ApiResponse({ status: 400, description: 'Bad request. CPF or password not satisfied some conditions.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials. CPF or password are invalid.' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  resetPassword(@Body() data: any) {
    return this.usersService.resetPassword(data.id)
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Users found', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findAll(
    @Query('pagination') paginationDto: PaginationDto,
    @Query('type') type: string,
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
    @Query('pagination') paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.usersService.findClients(paginationDto, user);
  }

  @Get(':search')
  @Auth()
  findOne(@Param('search') search: string) {
    return this.usersService.findOne(search);
  }
  
  @Get('/exist/:search')
  @Auth()
  clientExist(@Param('search') search: string) {
    return this.usersService.clientExist(search);
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
