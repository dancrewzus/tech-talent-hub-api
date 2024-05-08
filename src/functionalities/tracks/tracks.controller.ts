import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Track } from './entities/track.entity';

import { TracksService } from './tracks.service';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tracksService.findAll(paginationDto);
  }

  @Get(':type/:search')
  @ApiResponse({ status: 200, description: 'Track found.', type: Track })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorResponseDto })
  @ApiResponse({ status: 500, description: 'Internal error.', type: ErrorResponseDto })
  findOne(
    @Param('type') type: string,
    @Param('search') search: string,
  ) {
    return this.tracksService.findBy({ type, search });
  }
}
