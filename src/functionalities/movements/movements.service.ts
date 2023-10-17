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

dayjs.tz.setDefault('America/Manaus')

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

  private parseDay = (day: number): string => {
    switch (day) {
      case 0: return 'Sun';
      case 1: return 'Mon';
      case 2: return 'Tue';
      case 3: return 'Wed';
      case 4: return 'Thu';
      case 5: return 'Fri';
      case 6: return 'Sat';
      default: return '';
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
        status: 'validated',
        validatedBy: userRequest.id,
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

      // Movements related

      const movements = await this.movementModel.find().sort({ createdAt: 'asc' }).populate('paymentPicture')
      const incomesMovementsFromToday = []
      const expensesMovementsFromToday = []

      let haveFinalMovement = false
      let expensesAmount = 0
      let incomesAmount = 0
      let beforeAmount = 0
      let todayAmount = 0

      let amountCollected = 0

      movements.forEach((movement) => {

        const isFromToday = movement.movementDate === today

        switch (movement.type) {

          case 'final':
            if(isFromToday) haveFinalMovement = true
            break;
          
          case 'in':
            if(!isFromToday) beforeAmount += movement.amount
            else {
              todayAmount += movement.amount
              incomesMovementsFromToday.push(this.formatReturnMovementData(movement))

              if(!movement.description.includes('Abono: ')) {
                incomesAmount += movement.amount  
              } else {
                amountCollected += movement.amount  
              }
            }
            break;

          case 'out':
            if(!isFromToday) beforeAmount -= movement.amount
            else {
              todayAmount -= movement.amount
              expensesMovementsFromToday.push(this.formatReturnMovementData(movement))

              if(!movement.description.includes('Nuevo contrato: ')) {
                expensesAmount += movement.amount  
              }
            }
            break;

          default: break;
        }
      });

      todayAmount += beforeAmount

      // Contracts related

      const activeContracts = await this.contractModel
        .find({ status: true })
        .sort({ createdAt: 'asc' })
        .populate('paymentList')
        .populate('movementList')

      let amountToBeCollected = 0
      let amountContractsFromToday = 0

      let paymentsToBeCollected = 0
      let contractsFromToday = 0
      let paymentsCollected = 0
        
      activeContracts.forEach((contract) => {

        const contractInitDate = dayjs(contract.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()
        const paymentList = contract.paymentList || []
        const totalPayments = contract.payments || 0
        const daysOff = contract.nonWorkingDays || ''
        const amount = contract.paymentAmount || 0
        const paymentDays: any[] = [];

        const havePayments = paymentList.length ? true : false

        let index = 0
        while (paymentDays.length < totalPayments) {

          const date = contractInitDate.add(index, 'day')
          const day = date.day()
          const parsedDay = this.parseDay(day)
          const isSameContractDate = date.isSame(contractInitDate)
          const isPayDay = !daysOff?.includes(parsedDay) && !isSameContractDate

          if(isPayDay) {
            paymentDays.push(date.format('DD/MM/YYYY'))

            if(date.format('DD/MM/YYYY') === today) {
              
              amountToBeCollected += amount
              paymentsToBeCollected++
              
              const havePaymentsByDate = havePayments ? paymentList?.filter((payment) => payment.paymentDate === today) : null
              
              if(havePaymentsByDate && havePaymentsByDate.length) {
                paymentsCollected++
              }
            }
          }


          index++
        }

        if(contractInitDate.format('DD/MM/YYYY') === today) {
          amountContractsFromToday += contract.loanAmount
          contractsFromToday++
        }

      });

      return {
        movementsFromToday: { incomesMovementsFromToday, expensesMovementsFromToday },
        closed: haveFinalMovement,
        amountContractsFromToday,
        paymentsToBeCollected,
        amountToBeCollected,
        contractsFromToday,
        paymentsCollected,
        amountCollected,
        expensesAmount,
        incomesAmount,
        beforeAmount,
        todayAmount,
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  public pending= async (userRequest: User) => {
    try {
      const movements = await this.movementModel.find({ status: 'pending' }).sort({ createdAt: 'asc' }).populate('paymentPicture')
      
      let todayAmount = 0

      movements.forEach((movement) => {
        todayAmount += movement.amount
      });


      return {
        todayAmount,
        data: movements.map((movement) => this.formatReturnMovementData(movement)),
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public validateMovement= async (id: string, userRequest: User) => {
    try {
      const movement = await this.movementModel.findById(id).populate('paymentList')
      if(!movement) {
        throw new NotFoundException(`Payment with id "${ id }" not found`)
      }
      const { paymentList } = movement
      for (let index = 0; index < paymentList.length; index++) {
        const payment = paymentList[index];
        payment.status = true
        await payment.save()
      }
      movement.status = 'validated'
      await movement.save()
      return

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
