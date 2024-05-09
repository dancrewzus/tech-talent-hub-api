import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { ErrorResponseDto } from 'src/common/dto/error-response.dto'
import { GetUser } from 'src/auth/decorators/get-user.decorator'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { ValidRoles } from 'src/auth/interfaces/valid-roles'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from '../users/entities/user.entity'
import { TracksService } from './tracks.service'
import { Track } from './entities/track.entity'

@ApiTags('Tracks')
@Controller('tracks')
@Auth(ValidRoles.Root)
export class TracksController {

  constructor(
    private readonly tracksService: TracksService
  ) {}
  
  @Get()
  @ApiResponse({ status: 200, description: 'Tracks list.', type: [Track] })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.tracksService.findAll(paginationDto, user)
  }
}
