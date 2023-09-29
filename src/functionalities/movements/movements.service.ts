import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * DATE MANAGEMENT
 */

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as timezone from 'dayjs/plugin/timezone'
import * as utc from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

dayjs.tz.setDefault('America/Sao_Paulo')

// END DATE MANAGEMENT

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { User } from 'src/functionalities/users/entities/user.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Image } from '../images/entities/image.entity';
import { Movement } from './entities/movement.entity';

@Injectable()
export class MovementsService {

  private defaultLimit: number;

  private formatReturnMovementData = (movement: Movement) => {
    return {
      id: movement.id,
      createdBy: movement.createdBy || null,
      contract: movement.contract || null,
      amount: movement.amount || 0,
      paymentPicture: movement.paymentPicture?.imageUrl || null,
      type: movement.type || '',
      description: movement.description || '',
      movementDate: movement.movementDate || '',
      createdAt: movement.createdAt || '',
      updatedAt: movement.updatedAt || '',
    }
  }

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name) private readonly movementModel: Model<Movement>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createMovementsDto: CreateMovementDto, userRequest: User) => {
    try {

      const now = dayjs.tz()
      const haveFinal = await this.movementModel.findOne({ type: 'final', movementDate: now.format('DD/MM/YYYY') })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'No es posible registrar más movimientos, verifique mañana',
        }
      }

      const {
        amount,
        type,
        description,
        paymentPicture,
      } = createMovementsDto

      const databasePaymentPicture = await this.imageModel.findOne({ _id : paymentPicture })
      if(!databasePaymentPicture) {
        throw new NotFoundException(`No es posible encontrar la imagen con ID "${ paymentPicture }"`)
      }

      await this.movementModel.create({
        createdBy: userRequest.id,
        amount,
        type,
        description,
        paymentPicture: databasePaymentPicture?.id || null,
        movementDate: now.format('DD/MM/YYYY'),
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      });

      return;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public dailyResume= async (userRequest: User) => {
    try {
      const today = dayjs.tz().format('DD/MM/YYYY')
      const yesterday = dayjs.tz().subtract(1, 'day').format('DD/MM/YYYY')

      const movementsFromYesterday = await this.movementModel.find({ movementDate: yesterday })
      const movementsFromToday = await this.movementModel.find({ movementDate: today }).sort({ createdAt: 'asc' }).populate('paymentPicture')

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
            description: 'Cierre de caja',
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
        movementsFromToday: movementsFromToday.filter((mov) => mov.type !== 'final').map((e) => this.formatReturnMovementData(e)),
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
