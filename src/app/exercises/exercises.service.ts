import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose/dist'
import { isValidObjectId, Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'

import { CreateExerciseDto } from './dto/create-exercise.dto'
import { UpdateExerciseDto } from './dto/update-exercise.dto'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { Exercise } from './entities/exercise.entity'

@Injectable()
export class ExercisesService {

  private defaultLimit: number

  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<Exercise>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private searchType = (search: string | number): string => {
    let type: string = 'invalid'
    if(isValidObjectId(search)) return 'id'
    if(isNaN(Number(search))) return 'name'
    return type
  }

  private handleExceptions = (error: any) => {
    if(error.code === 11000) {
      throw new BadRequestException(`Exercise already exists. ${ JSON.stringify(error.keyValue) }`)
    }
    throw new InternalServerErrorException(`Can't create exercise: ${ error }`)
  }

  public create = async (createExerciseDto: CreateExerciseDto) => {
    try {
      createExerciseDto.name = createExerciseDto.name.toLowerCase()
      const exercise = await this.exerciseModel.create(createExerciseDto)
      return exercise
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public insertMany = async (exercisesToInsert: CreateExerciseDto[]) => {
    try {
      const workout = await this.exerciseModel.insertMany( exercisesToInsert )
      return workout
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto
    try {
      return await this.exerciseModel.find()
        .limit( limit )
        .skip( offset )
        .sort({
          cratedAt: 1
        })
        .select('-__v')
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
    let exercise: Exercise
    const searchTypeResponse = this.searchType(search)
    try {
      switch (searchTypeResponse) {
        case 'id':
          exercise = await this.exerciseModel.findById(search)
          break
        case 'name':
          exercise = await this.exerciseModel.findOne({ name: search.toLocaleLowerCase() })
          break
        default:
          exercise = null
          break
      }
    } catch (error) {
      this.handleExceptions(error)
    }
    if(!exercise) throw new NotFoundException(`Exercise with ${ searchTypeResponse } "${ search }" not found.`)
    return exercise
  }

  public update = async (search: string, updateExerciseDto: UpdateExerciseDto) => {
    const exercise = await this.findOne(search)
    if(updateExerciseDto.name) updateExerciseDto.name = updateExerciseDto.name.toLocaleLowerCase()
    try {
      await exercise.updateOne(updateExerciseDto)
      return { ...exercise.toJSON(), ...updateExerciseDto }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    const { deletedCount } = await this.exerciseModel.deleteOne({ _id: id })
    if(deletedCount === 0)
      throw new NotFoundException(`Exercise with id "${ id }" not found.`)
    return
  }

  public deleteAll = async () => {
    await this.exerciseModel.deleteMany()
  }
}
