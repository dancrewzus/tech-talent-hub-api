import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {

  constructor(
    private readonly exercisesService: ExercisesService
  ) {}

  @Post()
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.exercisesService.findAll(paginationDto);
  }

  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.exercisesService.findOne(search);
  }

  @Patch(':search')
  update(@Param('search') search: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exercisesService.update(search, updateExerciseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.exercisesService.remove(id);
  }
}
