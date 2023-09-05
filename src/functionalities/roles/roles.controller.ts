import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Role } from './entities/role.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('Roles')
@Controller('roles')
@Auth(ValidRoles.Root)
export class RolesController {

  constructor(
    private readonly rolesService: RolesService
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Role created.', type: Role })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  
  @Get()
  @ApiResponse({ status: 200, description: 'Roles list.', type: [Role] })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @Get(':search')
  @ApiResponse({ status: 200, description: 'Role found.', type: Role })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  findOne(@Param('search') search: string) {
    return this.rolesService.findOne(search);
  }

  @Patch(':search')
  @ApiResponse({ status: 200, description: 'Role updated.', type: Role })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  update(@Param('search') search: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(search, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Role deleted.' })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
