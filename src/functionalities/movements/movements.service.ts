import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs'

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { User } from 'src/functionalities/users/entities/user.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Movement } from './entities/movement.entity';

@Injectable()
export class MovementsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name) private readonly movementModel: Model<Movement>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createMovementsDto: CreateMovementDto, userRequest: User) => {
    try {

      const haveFinal = await this.movementModel.findOne({ type: 'final' })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'Não é mais possível cadastrar mais movimentos, verifique amanhã',
        }
      }

      const {
        amount,
        type,
        description,
        movementDate,
      } = createMovementsDto

      await this.movementModel.create({
        createdBy: userRequest.id,
        amount,
        type,
        description,
        movementDate,
      });

      return;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public dailyResume= async (userRequest: User) => {
    try {
      const today = dayjs().format('DD/MM/YYYY')
      const yesterday = dayjs().subtract(1, 'day').format('DD/MM/YYYY')

      const movementsFromYesterday = await this.movementModel.find({ movementDate: yesterday })
      const movementsFromToday = await this.movementModel.find({ movementDate: today }).sort({ createdAt: 'asc' })

      let haveFinalMovement = false
      let calculatedYesterdayAmount = 0
      let yesterdayAmount = 0
      let todayAmount = 0

      if(movementsFromYesterday && movementsFromYesterday.length) {
        const haveFinalMovement = movementsFromYesterday.find((mov) => mov.type === 'final')

        movementsFromYesterday.forEach((movement) => {

          switch (movement.type) {
            
            case 'final':
              yesterdayAmount += movement.amount
              break;
            
            case 'in':
              calculatedYesterdayAmount += movement.amount
              break;

            case 'out':
              calculatedYesterdayAmount -= movement.amount
              break;

            default: break;
          }
        });

        if(!haveFinalMovement) {
          await this.movementModel.create({
            createdBy: userRequest.id,
            amount: calculatedYesterdayAmount,
            type: 'final',
            description: 'Feche a caixa',
            movementDate: yesterday,
          })

          yesterdayAmount = calculatedYesterdayAmount
        }
      }


      todayAmount += yesterdayAmount
      
      if(movementsFromToday && movementsFromToday.length) {
        const finalMov = movementsFromToday.find((mov) => mov.type === 'final')
        haveFinalMovement = finalMov ? true : false

        movementsFromToday.forEach((movement) => {
          switch (movement.type) {

            case 'in':
              todayAmount += movement.amount
              break;

            case 'out':
              todayAmount -= movement.amount
              break;
          
            default: break;
          }
        });
      }

      return {
        yesterdayAmount,
        todayAmount,
        movementsFromToday: movementsFromToday.filter((mov) => mov.type !== 'final'),
        closed: haveFinalMovement
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} movement`;
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }

  remove(id: number) {
    return `This action removes a #${id} movement`;
  }
}
