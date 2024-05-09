import { Controller, Get, Param, Delete, Query, Ip } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { NotificationsService } from './notifications.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Notification } from './entities/notification.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {

  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Notification updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: User,
    @Ip() userIp: string
  ) {
    return this.notificationsService.findOne(id, user, userIp);
  }
  
  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Notifications found', type: [Notification] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  findAll(
    @Query('pagination') paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.notificationsService.findAll(paginationDto, user);
  }


  @Delete(':id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: User,
    @Ip() userIp: string
  ) {
    return this.notificationsService.remove(id, user, userIp);
  }
}
