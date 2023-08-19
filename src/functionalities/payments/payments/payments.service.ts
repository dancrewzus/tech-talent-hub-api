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

  public create = async (createPaymentDto: CreatePaymentDto, userRequest: User) => {
    const { client, contract, amount, paymentDate, paymentNumber } = createPaymentDto
    try {
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
      await contractExist.save();
      return payment;
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
