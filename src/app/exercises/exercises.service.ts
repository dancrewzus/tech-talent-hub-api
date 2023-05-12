import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  create(createExerciseDto: CreateExerciseDto) {
    return 'This action adds a new exercise';
  }

  findAll = async () => {
    return `This action returns all exercises`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exercise`;
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }

  loadData = async () => {
    try {
      const response = await axios.get('https://admin.levelarriendos.cl/proyectos');
      console.log("🚀 ~ file: exercises.service.ts:32 ~ ExercisesService ~ loadData= ~ response:", response)
    } catch (error) {
      throw new Error(error)
    }
  }
}
