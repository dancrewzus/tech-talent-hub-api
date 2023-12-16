import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { User } from 'src/functionalities/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';

import { CreateMovementDto } from './dto/create-movement.dto';
// import { UpdateMovementDto } from './dto/update-movement.dto';
import { MovementsService } from './movements.service';
import { Movement } from './entities/movement.entity';

@Controller('movements')
export class MovementsController {
  
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @ApiResponse({ status: 201, description: 'Contract created', type: Movement })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  create(
    @Body() createMovementDto: CreateMovementDto,
    @GetUser() user: User
  ) {
    return this.movementsService.create(createMovementDto, user);
  }
  
  @Post('validate-movement')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Contract created', type: Movement })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  validateMovement(
    @Body() data: any,
    @GetUser() user: User
  ) {
    return this.movementsService.validateMovement(data, user);
  }
  
  @Post('cancel-movement')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Contract created', type: Movement })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  cancelMovement(
    @Body() data: any,
    @GetUser() user: User
  ) {
    return this.movementsService.cancelMovement(data.id, user);
  }

  @Get('from-today/:type')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Daily resume data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  movementsFromToday(
    @Param('type') type: string,
    @GetUser() user: User
  ) {
    return this.movementsService.movementsFromToday(type, user);
  }
  
  @Get('daily-resume/:id')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Daily resume data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  dailyResume(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.movementsService.dailyResume(id, user);
  }
  
  @Get('delete-comment/:id')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Daily resume data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  deleteComment(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.movementsService.deleteComment(id, user);
  }

  @Get('pending')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Daily resume data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  pending(
    @GetUser() user: User
  ) {
    return this.movementsService.pending(user);
  }
  
  @Get('pending-count')
  @HttpCode(200)
  @Auth()
  @ApiResponse({ status: 200, description: 'Daily resume data' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiResponse({ status: 500, description: 'Internal error' })
  pendingCount(
    // @GetUser() user: User
  ) {
    return this.movementsService.pendingCount(/* user */);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.movementsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMovementDto: UpdateMovementDto) {
  //   return this.movementsService.update(+id, updateMovementDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.movementsService.remove(+id);
  // }
}
