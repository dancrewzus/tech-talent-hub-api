import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose/dist'
import { isValidObjectId, Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'

import { TensorflowUtil } from 'src/common/utils/tensorflow.util'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkoutDto } from './dto/update-workout.dto'
import { Workout } from './entities/workout.entity'

@Injectable()
export class WorkoutsService {

  private defaultLimit: number

  constructor(
    @InjectModel(Workout.name)
    private readonly workoutModel: Model<Workout>,
    private readonly configService: ConfigService,
    private readonly tensorflow: TensorflowUtil,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private searchType = (search: string | number): string => {
    let type: string = 'invalid'
    if(isValidObjectId(search)) return 'id'
    if(isNaN(Number(search))) return 'user'
    return type
  }

  private handleExceptions = (error: any) => {
    throw new InternalServerErrorException(`An error has occurred: ${ error.message }`)
  }

  public create = async (createWorkoutDto: CreateWorkoutDto) => {
    try {
      const workout = await this.workoutModel.create(createWorkoutDto)
      return workout
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public insertMany = async (workoutsToInsert: CreateWorkoutDto[]) => {
    try {
      const workout = await this.workoutModel.insertMany( workoutsToInsert )
      return workout
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto
    try {
      return await this.workoutModel.find()
        .limit( limit )
        .skip( offset )
        .sort({
          no: 1
        })
        .select('-__v')
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
    let workout: Workout
    const searchTypeResponse = this.searchType(search)
    try {
      switch (searchTypeResponse) {
        case 'id':
          workout = await this.workoutModel.findById(search)
          break
        case 'user':
          workout = await this.workoutModel.findOne({ user: search })
          break
        default:
          workout = null
          break
      }
    } catch (error) {
      this.handleExceptions(error)
    }
    if(!workout) throw new NotFoundException(`Workout with ${ searchTypeResponse } "${ search }" not found.`)
    return workout
  }

  public update = async (search: string, updateWorkoutDto: UpdateWorkoutDto) => {
    const workout = await this.findOne(search)
    try {
      await workout.updateOne(updateWorkoutDto)
      return { ...workout.toJSON(), ...updateWorkoutDto }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    const { deletedCount } = await this.workoutModel.deleteOne({ _id: id })
    if(deletedCount === 0)
      throw new NotFoundException(`Workout with id "${ id }" not found.`)
    return
  }

  public deleteAll = async () => {
    await this.workoutModel.deleteMany()
  }

  /**
   * Tensorflow
   */

  public predictPerformance = async (data) => {
    const { user, exercise, reps, sets } = data
    try {
      const workouts: Workout[] = await this.workoutModel.find({ user })
      const filteredExercises = workouts.flatMap(workout => {
        return workout.exercises.filter(exercise_ => exercise_.exercise.name === exercise);
      });
      const dataset = []
      filteredExercises.forEach(exercise => {
        dataset.push({
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        })
      });
      const prediction = await this.tensorflow.predictAthleteWeight(
        dataset, 
        {
          reps: Number.parseInt(reps),
          sets: Number.parseInt(sets),
        }
      );
      return `The weight that the athlete should use is: ${ prediction } kg.`
    } catch (error) {
      this.handleExceptions(error)
    }
  }
}
