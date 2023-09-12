import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { User } from 'src/functionalities/users/entities/user.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { Movement } from '../movements/entities/movement.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { BSON } from 'mongodb';

@Injectable()
export class PaymentsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name) private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createPaymentsDto: CreatePaymentDto[], userRequest: User) => {
    try {

      const haveFinal = await this.movementModel.findOne({ type: 'final' })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'Não é mais possível cadastrar mais movimentos, verifique amanhã',
        }
      }
      
      const { client, contract } = createPaymentsDto[0]

      const clientId = new BSON.ObjectId( client )
      const contractExist = await this.contractModel
        .findOne({ _id: contract })
        .populate('client')
        .populate('paymentList')
        .populate('movementList')

      if(!contractExist) {
        throw new BadRequestException(`Invalid contract`)
      }

      if(!contractExist.client._id.equals(clientId)) {
        throw new BadRequestException(`Invalid client`)
      }

      let totalAmount = 0

      for (let index = 0; index < createPaymentsDto.length; index++) {
        const createPaymentDto = createPaymentsDto[index];
        const { client, contract, amount, paymentDate, paymentNumber } = createPaymentDto
        // TODO: Manage images
        const payment = await this.paymentModel.create({
          createdBy: userRequest.id,
          client,
          contract,
          amount,
          paymentNumber,
          paymentDate,
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
        type: 'in',
        description: 'Pagamento relacionado ao contrato'
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
