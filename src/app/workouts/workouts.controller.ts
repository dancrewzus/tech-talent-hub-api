import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
export class WorkoutsController {

  constructor(
    private readonly workoutsService: WorkoutsService
  ) {}

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto) {
    return this.workoutsService.create(createWorkoutDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.workoutsService.findAll(paginationDto);
  }

  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.workoutsService.findOne(search);
  }

  @Patch(':search')
  update(@Param('search') search: string, @Body() updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutsService.update(search, updateWorkoutDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.workoutsService.remove(id);
  }
}
