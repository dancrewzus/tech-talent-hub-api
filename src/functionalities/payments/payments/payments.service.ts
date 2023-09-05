import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contract } from 'src/functionalities/contracts/entities/contracts.entity';
import { User } from 'src/functionalities/users/entities/user.entity';
import { HandleErrors } from 'src/common/utils/handleErrors.util';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { BSON } from 'mongodb';

@Injectable()
export class PaymentsService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createPaymentsDto: CreatePaymentDto[], userRequest: User) => {
    try {

      const { client, contract } = createPaymentsDto[0]

      const clientId = new BSON.ObjectId( client )
      const contractExist = await this.contractModel
        .findOne({ _id: contract })
        .populate('client')
        .populate('paymentList')

      if(!contractExist) {
        throw new BadRequestException(`Invalid contract`)
      }

      if(!contractExist.client._id.equals(clientId)) {
        throw new BadRequestException(`Invalid client`)
      }

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
        console.log("🚀 ~ file: payments.service.ts:57 ~ PaymentsService ~ create= ~ contractExist:", contractExist)
        for(const payment of contractExist?.paymentList) {
          console.log("🚀 ~ file: payments.service.ts:58 ~ PaymentsService ~ create= ~ payment:", payment)
          payments = payments + payment.amount
        }
  
        await contractExist.save();
  
        console.log("🚀 ~ file: payments.service.ts:63 ~ PaymentsService ~ create= ~ payments:", payments)
        console.log("🚀 ~ file: payments.service.ts:64 ~ PaymentsService ~ create= ~ contractExist.totalAmount:", contractExist.totalAmount)
        if(payments === contractExist.totalAmount) {
          contractExist.status = false
          await this.contractModel.updateOne({ _id: contract }, { status: false })
        }
  
      }
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
