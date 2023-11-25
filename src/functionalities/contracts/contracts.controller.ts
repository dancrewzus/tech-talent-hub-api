import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from '../users/entities/user.entity'

import { CreateContractDto } from './dto/create-contract.dto'
import { ContractsService } from './contracts.service'
import { Contract } from './entities/contracts.entity'

@ApiTags('Contracts')
@Controller('contracts')
@Auth()
export class ContractsController {

  constructor(private readonly contractService: ContractsService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'Contract created', type: Contract })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Body() createContractDto: CreateContractDto,
    @GetUser() user: User
  ) {
    return this.contractService.create(createContractDto, user)
  }

  @Post('cancel-contract')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Contract deleted', type: Contract })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  cancelMovement(
    @Body() data: any,
    @GetUser() user: User
  ) {
    return this.contractService.cancelContract(data.id, user);
  }
  
  @Get()
  @Auth(ValidRoles.Root)
  @ApiResponse({ status: 200, description: 'Contract list', type: [Contract] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  findAll(
    @Query('pagination') paginationDto: PaginationDto
  ) {
    return this.contractService.findAll(paginationDto)
  }

  @Get('from-today')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Daily resume data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  movementsFromToday(
    @GetUser() user: User
  ) {
    return this.contractService.contractsFromToday(user);
  }

  @Get('/pending')
  @Auth()
  @ApiResponse({ status: 200, description: 'Contracts with pending payments found', type: [Contract] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findPendingPayments(
    @GetUser() user: User
  ) {
    return this.contractService.findPendingPayments(user)
  }

  @Get('/user/:id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Contract found', type: Contract })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findByUser(
    @Param('id') id: string
  ) {
    return this.contractService.findLastContract(id)
  }
  
  @Get('/recalculate/user/:id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Contract found', type: Contract })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  recalculateLastContract(
    @Param('id') id: string
  ) {
    return this.contractService.recalculateLastContract(id)
  }

  @Get(':search')
  @Auth()
  @ApiResponse({ status: 200, description: 'Contract found', type: Contract })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findOne(
    @Param('search') search: string
  ) {
    return this.contractService.findOne(search)
  }
  
  @Delete(':id')
  @Auth(ValidRoles.Root, ValidRoles.Administrator, ValidRoles.Athlete)
  @ApiResponse({ status: 200, description: 'Contract deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  remove(
    @Param('id', ParseMongoIdPipe) id: string
  ) {
    return this.contractService.remove(id)
  }
}
