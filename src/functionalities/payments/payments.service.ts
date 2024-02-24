import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BSON } from 'mongodb';

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
import { Geolocation } from '../movements/entities/location.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { Movement } from '../movements/entities/movement.entity';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Image } from '../images/entities/image.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {

  private defaultLimit: number;

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  constructor(
    @InjectModel(Geolocation.name, 'default') private readonly locationModel: Model<Geolocation>,
    @InjectModel(Contract.name, 'default') private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name, 'default') private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name, 'default') private readonly paymentModel: Model<Payment>,
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
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

  private recalculateLastContract = async (clientId: string, contractId: string) => {

    const client = await this.userModel.findOne({ _id: clientId }).populate('createdBy')

    if(!client) {
      throw new BadRequestException(`Cliente incorrecto`)
    }

    const lastContract = await this.contractModel
        .findOne({ _id: contractId })
        .populate('createdBy')
        .populate('paymentList')
        .populate('movementList')

    const now = dayjs.tz()
    const paymentDays: any[] = [];

    const contractInitDate = dayjs(lastContract.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()

    const { paymentList, movementList, paymentAmount, payments, nonWorkingDays } = lastContract

    let paymentsIndex = 0
    while (paymentDays.length < payments) {
      const date = contractInitDate.add(paymentsIndex, 'day')
      const day = date.day()
      const parsedDay = this.parseDay(day)
      const isSameContractDate = date.isSame(contractInitDate)
      const isPayDay = !nonWorkingDays?.includes(parsedDay) && !isSameContractDate

      if(isPayDay) {
        paymentDays.push(date)
      }

      paymentsIndex++
    }
    
    const paymentsToDelete = paymentList.map((pay) => pay.id)

    // How much client payed
    const payed = movementList.reduce((amount, movement) => amount + movement.amount, 0)
    const newPayments = []

    let havePendingMovement = false
    let paymentNumber = 1
    for (let index = 0; index < movementList.length; index++) {
      const movement = await this.movementModel.findOne({ _id: movementList[index]?.id });

      const contractExist = await this.contractModel
        .findOne({ _id: movement.contract })

      if(!contractExist) {
        throw new BadRequestException(`No es posible encontrar el contrato"`)
      }

      let movementPaymentAmount = movement.amount
      
      while(movementPaymentAmount > 0) {
        
        let payed = 0

        const lastPayment = newPayments.length ? newPayments[newPayments.length - 1] : null
        const lastNumber = lastPayment ? lastPayment.paymentNumber : null
        
        if(lastPayment) {
          const lastNumberTotalPayed = newPayments
            .filter((payment) => payment.paymentNumber === lastNumber)
            .reduce((amount, payment) => amount + payment.amount, 0)

          if(lastNumberTotalPayed < paymentAmount) {
            const debt = paymentAmount - lastNumberTotalPayed
            if(movementPaymentAmount >= debt) {
              payed = debt              
            } else {
              payed = movementPaymentAmount
            }
            paymentNumber--
          }
        }

        if(payed === 0) {
          payed = movementPaymentAmount < paymentAmount ? movementPaymentAmount : paymentAmount
        }


        newPayments.push({
          createdBy: movement.createdBy,
          status: movement.status === 'validated' ? true : false,
          client: contractExist.client,
          contract: movement.contract,
          movement: movement.id,
          amount: payed,
          paymentNumber: paymentNumber,
          paymentDate: dayjs(paymentDays[paymentNumber - 1]).tz().format('DD/MM/YYYY'),
          paymentPicture: movement.paymentPicture,
          createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
          updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        })

        movementPaymentAmount -= payed
        paymentNumber++
        
        movement.paymentList = []
        await movement.save()
      }

      if(!havePendingMovement) {
        havePendingMovement = movement.status === 'pending' ? true : false
      }
    }

    const totalPayed = newPayments.reduce((amount, payment) => amount + payment.amount, 0)
    
    if(payed === totalPayed) {
      try {
        for (let index = 0; index < paymentsToDelete.length; index++) {
          const paymentId = paymentsToDelete[index];
          await this.paymentModel.deleteOne({ _id: paymentId })
          lastContract.paymentList = []
          await lastContract.save()
        }

        for (let index = 0; index < newPayments.length; index++) {
          const payment = newPayments[index];
          const created = await this.paymentModel.create(payment)
          const movement = await this.movementModel.findOne({ _id: payment.movement }).populate('paymentList')
          lastContract.paymentList.push(created)
          movement.paymentList.push(created)
          await lastContract.save()
          await movement.save()
        }

        if(totalPayed === lastContract.totalAmount && !havePendingMovement) {
          lastContract.status = false
          client.points = !lastContract.isOutdated ? client.points + 1 : client.points - 1
          await lastContract.save()
          await client.save()
        }
      } catch (error) {
        console.log("🚀 ~ file: contracts.service.ts:755 ~ ContractsService ~ recalculateLastContract= ~ error:", error)
        throw new Error(error)
      }
    }
    
    return { data: 'ok' }
  }

  public create = async (data: any, userRequest: User) => {
    try {

      const { movementDto, geolocation, contractData } = data
      const now = dayjs.tz()
      const haveFinal = await this.movementModel.findOne({ type: 'final', movementDate: now.format('DD/MM/YYYY'), createdBy: userRequest.id })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'No es posible registrar más movimientos, verifique mañana.',
        }
      }
      
      const { amount, paymentPicture } = movementDto
      const { client, contract } = contractData

      const clientId = new BSON.ObjectId( client )
      const contractExist = await this.contractModel
        .findOne({ _id: contract, status: true })
        .populate('client')
        .populate('movementList')
      
      const clientExist = await this.userModel.findById(clientId)

      if(!contractExist || !clientExist) {
        throw new BadRequestException(`No es posible encontrar el contrato/cliente con ID "${ contract }"`)
      }

      if(!contractExist.client._id.equals(clientId)) {
        throw new BadRequestException(`Cliente incorrecto`)
      }

      const databasePaymentPicture = await this.imageModel.findOne({ _id : paymentPicture })
      if(!databasePaymentPicture) {
        throw new NotFoundException(`No es posible encontrar la imagen con ID "${ paymentPicture }"`)
      }

      // let totalAmount = 0
      // const paymentsToCreate = []

      // for (let index = 0; index < createPaymentsDto.length; index++) {
      //   const createPaymentDto = createPaymentsDto[index];
      //   const { client, contract, amount, paymentDate, paymentNumber } = createPaymentDto
      //   paymentsToCreate.push({
      //     createdBy: userRequest.id,
      //     status: userRequest.role.name != 'client' ? true : false,
      //     client,
      //     contract,
      //     amount,
      //     paymentNumber,
      //     paymentDate,
      //     paymentPicture: databasePaymentPicture?.id || null,
      //     createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
      //     updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      //   });
  
      //   let payments = 0
      //   for(const payment of contractExist?.paymentList) {
      //     payments = payments + payment.amount
      //   }

      //   if(!contractExist.isOutdated && payments === contractExist.totalAmount) {
      //     contractExist.status = false
      //     clientExist.points = clientExist.points + 1
      //   }

      //   totalAmount += Number.parseInt(`${ amount }`)
      // }

      const movementExist = contractExist?.movementList.find((mov) => mov.amount === amount && mov.movementDate === now.format('DD/MM/YYYY'))

      if(movementExist !== undefined) {
        throw {
          code: 3000,
          message: `El movimiento ya fue ingresado, verifique los movimientos del cliente`,
        }
      }

      // MOVEMENT CREATE
      const movement = await this.movementModel.create({
        createdBy: userRequest.id,
        status: userRequest.role.name != 'client' ? 'validated' : 'pending',
        validatedBy: userRequest.role.name != 'client' ? userRequest.id : null,
        contract,
        amount,
        paymentPicture: databasePaymentPicture?.id || null,
        type: 'in',
        description: `[Abono]: ${ this.capitalizeFirstLetter(contractExist.client.firstName) } ${ this.capitalizeFirstLetter(contractExist.client.paternalSurname) }`,
        movementDate: now.format('DD/MM/YYYY'),
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      })

      // Create only if it's a real location
      if(geolocation && geolocation.latitude !== 0 && geolocation.longitude !== 0) {
        await this.locationModel.create({
          createdBy: userRequest.id,
          client: clientId,
          contract: contractExist._id,
          movement: movement.id,
          latitude: geolocation?.latitude || 0,
          longitude: geolocation?.longitude || 0,
          createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
          updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        })
      }

      // for (let index = 0; index < paymentsToCreate.length; index++) {
      //   const payment = paymentsToCreate[index];
      //   const pay = await this.paymentModel.create({ ...payment, movement: movement.id })
      //   contractExist.paymentList.push(pay);
      //   movement.paymentList.push(pay);
      // }

      // await movement.save();

      
      contractExist.movementList.push(movement)
      await contractExist.save()
      
      await this.recalculateLastContract(clientExist.id, contractExist.id)
      // await clientExist.save()

      return;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
