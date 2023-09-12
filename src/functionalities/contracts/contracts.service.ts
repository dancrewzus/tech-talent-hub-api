import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { CreateContractDto } from './dto/create-contract.dto'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { Contract } from './entities/contracts.entity'
import { User } from '../users/entities/user.entity'

import * as customParseFormat from 'dayjs/plugin/customParseFormat'
import * as dayjs from 'dayjs'
dayjs.extend(customParseFormat)

@Injectable()
export class ContractsService {

  private defaultLimit: number;
  private ColorConstants: any = {
    NOT_PAY_DAY: '#151515',
    CLIENT_RECEIVE_PAY: '#2167CA',
    PAY_DAY: '#FFFFFF',
    NOT_PAYED: '#FF0000',
    PAYED: '#22FF00',
  };

  private getUserPermissions = (roleName: string): string => {
    switch (roleName) {
      case 'root': return 'Rt';
      case 'admin': return 'Adm';
      case 'client': return 'Clt';
      case 'collector': return 'Cll';
      default: return '';
    }
  }

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private formatReturnData = (contract: Contract) => {
    const mapped = {
      id: contract.id,
      createdBy: contract.createdBy || null,
      client: contract.client || null,
      modality: contract.modality || '',
      modalityOptions: contract.modalityOptions || '',
      loanAmount: contract.loanAmount || 0,
      percent: contract.percent || 0,
      payments: contract.payments || 0,
      paymentAmount: contract.paymentAmount || 0,
      totalAmount: contract.totalAmount || 0,
      nonWorkingDays: contract.nonWorkingDays || '',
      status: contract.status || false,
      lastContractDate: contract.lastContractDate || '',
      paymentList: contract.paymentList || [],
      movementList: contract.movementList || [],
      createdAt: contract.createdAt || '',
      updatedAt: contract.updatedAt || '',
    }
    return mapped
  }

  private formatReturnClientData = (user: User) => {
    if(!user.isActive) return
    const permission: string = user.role 
      ? this.getUserPermissions(user.role.name) 
      : ''

    return {
      permission,
      id: user.id,
      cpf: user.cpf,
      email: user.email,
      isLogged: user.isLogged,
      fullname: `${ this.capitalizeFirstLetter(user.firstName) } ${ this.capitalizeFirstLetter(user.paternalSurname) }` || '',
      firstName: this.capitalizeFirstLetter(user.firstName) || '',
      secondName: this.capitalizeFirstLetter(user.secondName) || '',
      paternalSurname: this.capitalizeFirstLetter(user.paternalSurname) || '',
      maternalSurname: this.capitalizeFirstLetter(user.maternalSurname) || '',
      birthDate: user.birthDate || '',
      profilePicture: user.profilePicture || '',
      residenceAddress: user.residenceAddress || '',
      billingAddress: user.billingAddress || '',
      phoneNumber: user.phoneNumber || '',
      createdBy: user.createdBy ? this.formatReturnClientData(user.createdBy) : null,
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
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createContractDto: CreateContractDto, userRequest: User) => {
    try {
      const { client, ...contractData } = createContractDto
      const clientExist = await this.userModel.findOne({ _id: client })
      if(!clientExist) {
        throw new BadRequestException(`Invalid client`)
      }
      const contract = await this.contractModel.create({
        createdBy: userRequest.id,
        client: clientExist.id,
        ...contractData,
      });
      return contract;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      return await this.contractModel.find()
        .limit( limit )
        .skip( offset )
        .sort({ createdAt: 'asc' })
        .populate({ path: 'user' })
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  public findPendingPayments = async () => {
    try {

      const contractsQuantity = await this.contractModel.count({ status: true })
      const contracts = await this.contractModel.find({ status: true })
        .sort({ createdAt: 'asc' })
        .populate({ path: 'client' })
        .populate({ path: 'paymentList' })

      const today = dayjs()
      const clients: any = []

      contracts.forEach((contract) => {
        const { paymentList, client, payments, createdAt, nonWorkingDays, paymentAmount } = contract
        const contractInitDate = dayjs(createdAt, 'DD/MM/YYYY HH:mm:ss', true)
        const havePayments = paymentList.length ? true : false
        const paymentDays: any[] = [];

        let daysLate = 0
        let daysIncomplete = 0
        
        let index = 0
        while (paymentDays.length < payments) {
          
          const date = contractInitDate.add(index, 'day')
          const day = date.day()
          const parsedDay = this.parseDay(day)
          const isSameContractDate = date.isSame(contractInitDate)
          const isBefore = date.isBefore(today)
          const isToday = date.isSame(today, 'date')
          const isPayDay = !nonWorkingDays?.includes(parsedDay) && !isSameContractDate

          // Es un día de pago
          if(isPayDay) {
            
            paymentDays.push(date)

            if(isBefore || isToday) {
              // Se han realizado pagos
              const exist = havePayments ? paymentList?.filter((payment) => payment.paymentDate === date.format('DD/MM/YYYY')) : null
              if(exist && exist.length) {
                let sum = 0
                exist.forEach((payment) => {
                  sum = sum + payment.amount
                });
                if(sum < paymentAmount) {
                  daysIncomplete++
                }
              } else {
                // Dias de atraso
                daysLate++
              }
            }
          }
          index++
        }

        if(daysLate > 0 || daysIncomplete > 0) {
          clients.push(this.formatReturnClientData(client))
        }
      })
      
      return {
        data: {
          contractsQuantity,
          clients
        }
      }
      
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findLastContract = async (clientId: string) => {
    try {
      const client = await this.userModel.findOne({ _id: clientId }).populate('createdBy')

      if(!client) {
        throw new BadRequestException(`Invalid client`)
      }

      const contractsQuantity = await this.contractModel.count({ client: clientId })
      const allContractsByUser = await this.contractModel
        .find({ client: clientId })
        .sort({ createdAt: 'asc' })
        .populate('createdBy')
        .populate('paymentList')
        .populate('movementList')

      const contractsByUser = allContractsByUser.filter((contract) => contract.status)

      if(!contractsByUser.length) {
        // throw new NotFoundException(`Contracts of user "${ clientId }" not found`)
        return {
          data: {
            haveActiveContracts: false,
            patchValue: {
              countContracts  : contractsQuantity,
              lastContractDate: dayjs(allContractsByUser[0]?.createdAt || null, 'DD/MM/YYYY HH:mm:ss', true).format('DD/MM/YYYY')
            }
          }
        }
      }

      const today = dayjs()
      const lastContract = this.formatReturnData(contractsByUser[0]);
      const paymentList = lastContract.paymentList
      const havePayments = paymentList.length ? true : false

      let paidAmount = 0
      let payments = 0

      const contractCreatedDate = dayjs(lastContract.createdAt, 'DD/MM/YYYY HH:mm:ss', true)
      const contractInitDate = dayjs(lastContract.createdAt, 'DD/MM/YYYY HH:mm:ss', true)
      const movementList = lastContract.movementList || []
      const totalPayments = lastContract.payments || 0
      const daysOff = lastContract.nonWorkingDays || ''
      const amount = lastContract.paymentAmount || 0
      
      // DATA to calculate and send
      const paymentIncompleteDays: any[] = [];
      const paymentAheadDays: any[] = [];
      const calendarEvents: any[] = []
      const paymentDays: any[] = [];

      let daysLate = 0
      let daysExpired = 0
      
      let index = 0
      while (paymentDays.length < totalPayments) {

        let color = this.ColorConstants.PAY_DAY
        const date = contractInitDate.add(index, 'day')
        const day = date.day()
        const parsedDay = this.parseDay(day)
        const isSameContractDate = date.isSame(contractInitDate)
        const isBefore = date.isBefore(today)
        const isToday = date.isSame(today, 'date')
        const isAhead = date.isAfter(today)
        const isPayDay = !daysOff?.includes(parsedDay) && !isSameContractDate
        const haveMovements = movementList.filter((mov) => mov.movementDate === date.format('DD/MM/YYYY'))

        // No es un día de pago
        if(!isPayDay) {
          color = this.ColorConstants.NOT_PAY_DAY
        }

        // Es el día que el cliente recibe el préstamo
        if(isSameContractDate) {
          color = this.ColorConstants.CLIENT_RECEIVE_PAY
        }

        // Es un día de pago
        if(isPayDay) {
          paymentDays.push(date)
        }

        // Se han realizado pagos
        const exist = havePayments ? paymentList?.filter((payment) => payment.paymentDate === date.format('DD/MM/YYYY')) : null
        if(exist && exist.length) {
          let sum = 0
          exist.forEach((payment) => {
            sum = sum + payment.amount
          });
          if(sum < amount) {
            color = this.ColorConstants.NOT_PAYED
            paymentIncompleteDays.push(exist)
          } else {
            color = this.ColorConstants.PAYED
            payments++
          }
          if(isAhead) {
            paymentAheadDays.push(date)
          }
        } else {
          // Dias de atraso
          if((isBefore || isToday) && isPayDay) {
            color = this.ColorConstants.NOT_PAYED
            daysLate++
          }
        }

        calendarEvents.push({
          start: date.format('YYYY-MM-DD') + 'T00:00:00',
          backgroundColor: color,
          display: 'background',
          allDay: true,
          title: haveMovements && haveMovements.length ? '*' : ''
        })

        index++
      }

      const contractEndDate = paymentDays[paymentDays.length - 1]

      // Dias expirados
      if(contractEndDate.isBefore(today)) {
        daysExpired = today.diff(contractEndDate, 'days')
      }

      let paymentClientNumber = 0
      let paymentClientAmount = 0

      if(paymentIncompleteDays[0]?.length) {
        let payed = 0
        paymentIncompleteDays[0].forEach((payment: any) => {
          paymentClientNumber = payment.paymentNumber
          payed += payment.amount
        });
        paymentClientAmount = amount - payed
      } else {
        paymentClientNumber = payments + 1
        paymentClientAmount = amount
      }

      if(havePayments) {
        paymentList?.forEach((payment) => {
          paidAmount += payment.amount
        });
      }

      const outstanding = lastContract?.totalAmount - paidAmount

      return {
        data: {
          createdBy: this.formatReturnClientData(client.createdBy) || null,
          haveActiveContracts: true,
          paymentIncompleteDays: paymentIncompleteDays[0] || [],
          paymentAheadDays: paymentAheadDays || [],
          lastContract,
          paymentDays,
          calendarEvents,
          patchValue: {
            countContracts  : contractsQuantity,
            lastContractDate: contractCreatedDate.format('DD/MM/YYYY'),
            clientOpen      : outstanding,
            clientStablish  : paidAmount,
            daysLate,
            daysExpired,
            paymentClientNumber,
            paymentClientAmount,
          }
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: string) => {
    console.log("🚀 ~ file: contracts.service.ts:127 ~ ContractsService ~ findOne= ~ search:", search)
    try {
      const contractById = await this.contractModel.findById(search)
      if(!contractById) {
        throw new NotFoundException(`Contract with id "${ search }" not found`)
      }
      return contractById;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string) => {
    const { modifiedCount } = await this.contractModel.updateOne({ _id: id }, { status: false })
    if(modifiedCount === 0)
      throw new NotFoundException(`Contract with id "${ id }" not found.`)
    return
  }
}
