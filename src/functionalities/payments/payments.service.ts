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
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { Movement } from '../movements/entities/movement.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Image } from '../images/entities/image.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name) private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createPaymentsDto: CreatePaymentDto[], userRequest: User) => {
    try {

      const now = dayjs.tz()
      const haveFinal = await this.movementModel.findOne({ type: 'final', movementDate: now.format('DD/MM/YYYY') })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'No es posible registrar más movimientos, verifique mañana',
        }
      }
      
      const { client, contract, paymentPicture } = createPaymentsDto[0]

      const clientId = new BSON.ObjectId( client )
      const contractExist = await this.contractModel
        .findOne({ _id: contract })
        .populate('client')
        .populate('paymentList')
        .populate('movementList')

      if(!contractExist) {
        throw new BadRequestException(`No es posible encontrar el contrato con ID "${ contract }"`)
      }

      if(!contractExist.client._id.equals(clientId)) {
        throw new BadRequestException(`Cliente incorrecto`)
      }

      const databasePaymentPicture = await this.imageModel.findOne({ _id : paymentPicture })
      if(!databasePaymentPicture) {
        throw new NotFoundException(`No es posible encontrar la imagen con ID "${ paymentPicture }"`)
      }

      let totalAmount = 0

      for (let index = 0; index < createPaymentsDto.length; index++) {
        const createPaymentDto = createPaymentsDto[index];
        const { client, contract, amount, paymentDate, paymentNumber } = createPaymentDto
        const payment = await this.paymentModel.create({
          createdBy: userRequest.id,
          client,
          contract,
          amount,
          paymentNumber,
          paymentDate,
          paymentPicture: databasePaymentPicture?.id || null,
          createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
          updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        });
  
        contractExist.paymentList.push(payment);
  
        let payments = 0
        for(const payment of contractExist?.paymentList) {
          payments = payments + payment.amount
        }

        if(payments === contractExist.totalAmount) {
          contractExist.status = false
        }

        await contractExist.save();
        totalAmount += Number.parseInt(`${ amount }`)
      }

      // MOVEMENT CREATE
      const movement = await this.movementModel.create({
        createdBy: userRequest.id,
        contract,
        amount: totalAmount,
        paymentPicture: databasePaymentPicture?.id || null,
        type: 'in',
        description: 'Pago relacionado a contrato',
        movementDate: now.format('DD/MM/YYYY'),
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      })

      contractExist.movementList.push(movement);
      await contractExist.save();

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
