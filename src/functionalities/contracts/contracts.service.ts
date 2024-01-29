import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

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

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { Movement } from '../movements/entities/movement.entity'
import { CreateContractDto } from './dto/create-contract.dto'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { Payment } from '../payments/entities/payment.entity'
import { Image } from '../images/entities/image.entity'
import { Contract } from './entities/contracts.entity'
import { User } from '../users/entities/user.entity'
import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { Holiday } from '../holidays/entities/holiday.entity'

@Injectable()
export class ContractsService {

  private defaultLimit: number;
  private ColorConstants: any = {
    NOT_PAY_DAY: '#FFFFFF',
    CLIENT_RECEIVE_PAY: '#2167CA',
    PAY_DAY: '#686868',
    NOT_PAYED: '#FF0000',
    PENDING: '#FFD900',
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

  private formatReturnPaymentListData = (payment: Payment) => {
    return {
      id: payment.id,
      createdBy: payment.createdBy || null,
      client: payment.client || null,
      contract: payment.contract || null,
      amount: payment.amount || 0,
      paymentNumber: payment.paymentNumber || 0,
      paymentPicture: payment.paymentPicture?.imageUrl || null,
      paymentDate: payment.paymentDate || '',
      createdAt: payment.createdAt || '',
      updatedAt: payment.updatedAt || '',
      status: payment.status || false,
    }
  }

  private formatReturnMovementListData = (movement: Movement) => {
    return {
      id: movement.id,
      createdBy: movement.createdBy || null,
      contract: movement.contract || null,
      amount: movement.amount || 0,
      paymentPicture: movement.paymentPicture?.imageUrl || null,
      type: movement.type || '',
      status: movement.status || '',
      description: movement.description || '',
      movementDate: movement.movementDate || '',
      createdAt: movement.createdAt || '',
      updatedAt: movement.updatedAt || '',
    }
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
      paymentList: contract.paymentList?.map((e) => this.formatReturnPaymentListData(e)).sort((a,b) => a.paymentNumber - b.paymentNumber) || [],
      movementList: contract.movementList?.map((e) => this.formatReturnMovementListData(e)) || [],
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
      profilePicture: user.profilePicture?.imageUrl || '',
      addressPicture: user.addressPicture?.imageUrl || '',
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

  private deleteMovementsAndPayments = async ({ contract }) => {
    try {
      
      const { paymentList, movementList, client } = contract

      const contractMovementDescription = `[Nuevo contrato]: ${ this.capitalizeFirstLetter(client.firstName) } ${ this.capitalizeFirstLetter(client.paternalSurname) }`

      // Delete payment list
      for (let index = 0; index < paymentList.length; index++) {
        const payment = paymentList[index];
        await payment.deleteOne()
      }
      
      // Delete movement list
      for (let index = 0; index < movementList.length; index++) {
        const movement = movementList[index];
        const { paymentPicture } = movement

        const picture = await this.imageModel.findById(paymentPicture)

        await this.cloudAdapter.deleteResource(picture.publicId)
        await picture.deleteOne()
        await movement.deleteOne()
      }

      const expenseMovement = await this.movementModel.findOne({ description: contractMovementDescription })

      if(expenseMovement) {
        await expenseMovement.deleteOne()
      }

      await contract.deleteOne()

      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  constructor(
    @InjectModel(Movement.name, 'default') private readonly movementModel: Model<Movement>,
    @InjectModel(Contract.name, 'default') private readonly contractModel: Model<Contract>,
    @InjectModel(Payment.name, 'default') private readonly paymentModel: Model<Payment>,
    @InjectModel(Holiday.name, 'default') private readonly holidayModel: Model<Holiday>,
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly cloudAdapter: CloudAdapter,
    private readonly handleErrors: HandleErrors,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  public create = async (createContractDto: CreateContractDto, userRequest: User) => {
    try {

      const now = dayjs.tz()
      const haveFinal = await this.movementModel.findOne({ type: 'final', movementDate: now.format('DD/MM/YYYY'), createdBy: userRequest.id })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'No es posible registrar más movimientos, verifique mañana',
        }
      }
      
      const { client, lastContractDate, ...contractData } = createContractDto

      const clientExist = await this.userModel.findOne({ _id: client })
      if(!clientExist) {
        throw new BadRequestException(`Cliente incorrecto`)
      }
      
      const contract = await this.contractModel.create({
        createdBy: userRequest.id,
        client: clientExist.id,
        lastContractDate: lastContractDate ? lastContractDate : now.format('DD/MM/YYYY'),
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
        ...contractData,
      });

      await this.movementModel.create({
        createdBy: userRequest.id,
        status: 'validated',
        validatedBy: userRequest.id,
        amount: contract.loanAmount,
        contract: contract.id,
        type: 'out',
        description: `[Nuevo contrato]: ${ this.capitalizeFirstLetter(clientExist.firstName) } ${ this.capitalizeFirstLetter(clientExist.paternalSurname) }`,
        movementDate: now.format('DD/MM/YYYY'),
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      })
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
  
  public findPendingPayments = async (userRequest: User) => {

    try {
      const contracts = await this.contractModel.find({ status: true, createdBy: userRequest.id })
        .sort({ createdAt: 'asc' })
        .populate({ path: 'client' })
        .populate({ path: 'paymentList' })

      const today = dayjs.tz()
      const pendingArray: any = []

      let totalIncomplete = 0 // Pagos por validar
      let totalPending = 0 // Pagos incompletos
      let totalExpired = 0 // Pagos atrasados
      let totalUnpaid = 0 // Pagos expirados
      let totalAhead = 0 // Pagos adelantados

      // Nombre/ monto del contrato/ lo que le falta/valor parcela/ parcela  atrasado/parcela  pagas/parcelas faltantes

      for (let index = 0; index < contracts.length; index++) {

        const contract = contracts[index];

        const { paymentList, client, payments, createdAt, nonWorkingDays, paymentAmount } = contract

        const clientData = await this.userModel.findOne({ _id: client }).populate('profilePicture').populate('addressPicture')

        let payed = 0
        let daysLate = 0
        let daysPayed = 0
        let daysAhead = 0
        let daysExpired = 0
        let daysPending = 0
        let daysIncomplete = 0
        let indexPayments = 0
        let pendingAmount = 0
        let todayIncomplete = false
        
        if(clientData.isActive) {

          const contractInitDate = dayjs(createdAt, 'DD/MM/YYYY HH:mm:ss').tz() //.format('DD/MM/YYYY HH:mm:ss')
          const havePayments = paymentList.length ? true : false
          const paymentDays: any[] = [];
          const aheadPayments: any[] = []
          
          if(havePayments) {
            paymentList.forEach((payment) => {
              payed += payment.amount
            });
          }
          
          while (paymentDays.length < payments) {
            
            const date = contractInitDate.add(indexPayments, 'day')
            const day = date.day()
            const parsedDay = this.parseDay(day)
            const isSameContractDate = date.isSame(contractInitDate)
            const isBefore = date.isBefore(today, 'date')
            const isToday = date.isSame(today, 'date')
            const isAhead = date.isAfter(today, 'date')
            const isPayDay = !nonWorkingDays?.includes(parsedDay) && !isSameContractDate
    
            // Es un día de pago
            if(isPayDay) {
              
              paymentDays.push(date)
              
              if(isAhead) {
                const paymentsFromAhead = havePayments ? paymentList?.filter((payment) => payment.paymentDate === date.format('DD/MM/YYYY')) : []
                paymentsFromAhead.forEach((payment) => {
                  aheadPayments.push(payment)
                });
              }
              
              if(isToday) {
                const paymentsFromToday = havePayments ? paymentList?.filter((payment) => payment.paymentDate === today.format('DD/MM/YYYY')) : []
                if (paymentsFromToday.length) {
                  let sum = 0
                  paymentsFromToday.forEach((payment) => {
                    sum += payment.amount
                    if(!payment.status) {
                      daysPending++
                    }
                  });
                  if(sum < paymentAmount) {
                    todayIncomplete = true
                    daysIncomplete++
                  } else {
                    daysPayed++
                  }
                } else {
                  if(!aheadPayments.length) {
                    daysLate++
                  }
                }
              }
  
              if(isBefore) {
                const paymentsFromBefore = havePayments ? paymentList?.filter((payment) => payment.paymentDate === date.format('DD/MM/YYYY')) : []
                if (paymentsFromBefore.length) {
                  let sum = 0
                  paymentsFromBefore.forEach((payment) => {
                    sum += payment.amount
                    if(!payment.status) {
                      daysPending++
                    }
                  });
                  if(sum >= paymentAmount) {
                    daysPayed++
                  } else {
                    daysIncomplete++
                  }
                } else {
                  if(!aheadPayments.length) {
                    daysLate++
                  }
                }
              }
            }
            indexPayments++
          }

          // Dias anticipados
          if(aheadPayments.length) {
            const lastPayment = aheadPayments[aheadPayments.length - 1]
            const createdAt = dayjs(lastPayment.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()
            const isPayedBefore = createdAt.isBefore(today, 'date')
            if(lastPayment.status && isPayedBefore) {
              daysAhead++
            }
          }

          // Dias expirados
          pendingAmount = contract.totalAmount - payed
          const contractEndDate = paymentDays[paymentDays.length - 1]
          if(contractEndDate.isBefore(today) && pendingAmount > 0) {
            daysExpired = today.diff(contractEndDate, 'days')
          }
        }
        
        if(
          daysIncomplete > 0 || 
          daysPending > 0 || 
          daysExpired > 0 ||
          daysAhead > 0 ||
          daysLate > 0
        ) {

          // if(clientData.id === '65948c56f75796c52384b10b') {
          //   console.log("🚀 ~ ContractsService ~ paymentsFromAhead.forEach ~ daysIncomplete:", daysIncomplete)
          //   console.log("🚀 ~ ContractsService ~ paymentsFromAhead.forEach ~ daysPending:", daysPending)
          //   console.log("🚀 ~ ContractsService ~ paymentsFromAhead.forEach ~ daysExpired:", daysExpired)
          //   console.log("🚀 ~ ContractsService ~ paymentsFromAhead.forEach ~ daysAhead:", daysAhead)
          //   console.log("🚀 ~ ContractsService ~ paymentsFromAhead.forEach ~ daysLate:", daysLate)
          // }

          let icon = 'x-circle' 
          let color = '' 
          
          if(daysLate > 0 && daysAhead === 0) {
            color = daysLate <= 1 ? '' : (daysLate === 2 ? 'orange' : 'red')
            totalUnpaid += 1
          }

          if(daysExpired > 0) {
            color = 'red'
            totalExpired += 1
          }
          
          if(daysAhead > 0) {
            icon = 'check'
            color = 'green'
            totalAhead += 1
            daysLate = 0
          }
          
          if(todayIncomplete) {
            icon = 'alert-triangle'
            totalIncomplete += 1
          }

          if(daysPending > 0) {
            totalPending += 1
          }

          pendingArray.push({
            client: this.formatReturnClientData(clientData),
            contractData: {
              loanAmount: contract.loanAmount, // Monto del prestamos
              amount: contract.totalAmount, // Monto total del contrato
              payed: payed, // Lo que ha pagado
              pending: pendingAmount, // Lo que le falta
              payment: paymentAmount, // Valor de la parcela
              late: daysLate, // Parcelas atrasadas
              upToDate: daysPayed, // Parcelas al día
              incomplete: daysIncomplete, // Parcelas restantes
              remaining: payments - daysPayed, // Parcelas restantes
              daysExpired,
              daysAhead,
              icon,
              color,
            }
          })
        }
      }
      
      return {
        data: {
          pendingArray,
          totalIncomplete,
          totalPending,
          totalExpired,
          totalUnpaid,
          totalAhead,
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
        throw new BadRequestException(`Cliente incorrecto`)
      }

      if(!client.isActive) {
        return {
          data: {
            haveActiveContracts: false,
            patchValue: {
              countContracts  : 0,
              lastContractDate: null
            }
          }
        }
      }

      const contractsQuantity = await this.contractModel.count({ client: clientId })

      const allContractsByUser = await this.contractModel
        .find({ client: clientId })
        .sort({ createdAt: 'asc' })
        .populate('createdBy')
        .populate('paymentList')
        .populate('movementList')

      const contractsByUser = []
      const activeContracts = allContractsByUser.filter((contract) => contract.status)
      
      // Check if contract is all payed
      for (let index = 0; index < activeContracts.length; index++) {
        const contract = activeContracts[index];
        const validatedMovements = contract.movementList.filter((movement) => movement.status === 'validated')
        const payed = validatedMovements.reduce((sum, mov) => sum + mov.amount, 0);
        if(payed === contract.totalAmount) {
          contract.status = false
          client.points = !contract.isOutdated ? client.points + 1 : client.points - 1
          await contract.save()
          await client.save()
        } else {
          contractsByUser.push(contract)
        }
      }

      if(!contractsByUser.length) {
        // throw new NotFoundException(`Contracts of user "${ clientId }" not found`)
        return {
          data: {
            haveActiveContracts: false,
            patchValue: {
              countContracts  : contractsQuantity,
              lastContractDate: allContractsByUser.length > 0 ? dayjs(allContractsByUser[0]?.createdAt, 'DD/MM/YYYY HH:mm:ss').tz() : null
            }
          }
        }
      }

      const holidays = await this.holidayModel.find()
      const holidaysDates = holidays.map((date) => date.holidayDate)

      const today = dayjs.tz()
      const lastContract = contractsByUser[0];

      const isOutdated = lastContract.isOutdated
      const movementList = [] 
      const paymentList = []
      
      // IMAGES MANAGE
      let paymentAmount = 0
      for (let index = 0; index < lastContract.paymentList.length; index++) {
        const payment = lastContract.paymentList[index];
        paymentAmount = paymentAmount + payment.amount
        const paymentPicture = await this.imageModel.findOne({ _id: payment.paymentPicture })
        payment.paymentPicture = paymentPicture ? paymentPicture : payment.paymentPicture
        lastContract.paymentList[index] = payment
        paymentList.push(payment)
      }

      let movementAmount = 0
      for (let index = 0; index < lastContract.movementList.length; index++) {
        const movement = lastContract.movementList[index];
        movementAmount = movementAmount + movement.amount
        const paymentPicture = await this.imageModel.findOne({ _id: movement.paymentPicture })
        movement.paymentPicture = paymentPicture ? paymentPicture : movement.paymentPicture
        lastContract.movementList[index] = movement
        movementList.push(movement)
      }
      // END 

      const havePayments = paymentList.length ? true : false

      let pendingForValidate = 0
      let paidIncompleteAmount = 0
      let paidAmount = 0
      let payments = 0

      const contractCreatedDate = dayjs(lastContract.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()
      const contractInitDate = dayjs(lastContract.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()
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
      // let pending = 0
      let mustTodayPayed = 0
      
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
        let isPayDay = !daysOff?.includes(parsedDay) && !isSameContractDate
        const haveMovements = movementList.filter((mov) => mov.movementDate === date.format('DD/MM/YYYY'))
        const formattedDate = date.format('DD/MM/YYYY')
        const isHoliday = holidaysDates?.includes(formattedDate)

        if(isHoliday) {
          isPayDay = false
        }

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
          if(isBefore || isToday) {
            mustTodayPayed += amount
          }
        }

        // Se han realizado pagos
        const havePaymentsByDate = havePayments ? paymentList?.filter((payment) => payment.paymentDate === date.format('DD/MM/YYYY')) : null
        if(havePaymentsByDate && havePaymentsByDate.length) {
          let sumPaymentByDate = 0
          havePaymentsByDate.forEach((payment) => { sumPaymentByDate = sumPaymentByDate + payment.amount });
          if(sumPaymentByDate < amount) {
            // const rest = amount - sumPaymentByDate
            color = this.ColorConstants.NOT_PAYED
            // pending += rest
            paidIncompleteAmount += sumPaymentByDate
            const existByDate = paymentIncompleteDays.findIndex((paymentDate) => paymentDate === date.format('DD/MM/YYYY'))
            if(existByDate === -1) {
              paymentIncompleteDays.push(date.format('DD/MM/YYYY'))
            }
          } else {
            color = this.ColorConstants.PAYED
            payments++
          }

          const havePendingPayments = havePaymentsByDate.filter((pay) => !pay.status)

          const groupByDate = []
          havePendingPayments.forEach((payment) => {
            const index = groupByDate.findIndex((pay) => pay.paymentDate === payment.paymentDate)
            if(index === -1) {
              groupByDate.push(payment)
              daysLate++
            }
          });

          color = havePendingPayments.length ? this.ColorConstants.PENDING : color

          if(isAhead) {
            paymentAheadDays.push(date)
            if(!isToday) {
              color = this.ColorConstants.PAYED
            }
          }
        } else {
          // Dias de atraso
          if((isBefore || isToday) && isPayDay) {
            color = this.ColorConstants.NOT_PAYED
            // pending += lastContract.paymentAmount
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
        if(daysExpired > 0) {
          if(!isOutdated) {
            await this.contractModel.updateOne({ _id: lastContract._id }, { isOutdated: true })
            client.points = client.points - 1
            await client.save()
          }
        }
      }


      let paymentClientNumber = 0
      let paymentClientAmount = 0

      if(paymentIncompleteDays?.length) {

        const paymentByDate = paymentList?.find((pay) => pay.paymentDate === paymentIncompleteDays[0])
        paymentClientNumber = paymentByDate.paymentNumber
        // let payed = 0
        // paymentIncompleteDays.forEach((payment: any) => {
        //   // payed += payment.amount
        // });
        paymentClientAmount = amount - paidIncompleteAmount
      } else {
        paymentClientNumber = payments + 1
        paymentClientAmount = amount
      }

      if(havePayments) {
        paymentList?.forEach((payment) => {
          // console.log("🚀 ~ file: contracts.service.ts:624 ~ ContractsService ~ paymentList?.forEach ~ payment:", payment)
          if(payment.status) {
            paidAmount += payment.amount
          } else {
            pendingForValidate += payment.amount
          }
        });
      }

      const outstanding = lastContract?.totalAmount - paidAmount
      const haveAdvancedPayments = paidAmount > mustTodayPayed ? true : false
      return {
        data: {
          haveActiveContracts: true,
          paymentIncompleteDays: paymentIncompleteDays || [],
          paymentAheadDays: paymentAheadDays || [],
          lastContract: this.formatReturnData(lastContract),
          paymentDays,
          calendarEvents,
          patchValue: {
            countContracts  : contractsQuantity,
            lastContractDate: contractCreatedDate.format('DD/MM/YYYY'),
            clientOpen      : outstanding,
            clientStablish  : paidAmount,
            pendingForValidate,
            pending: haveAdvancedPayments ? 0 : (mustTodayPayed - paidAmount),// () + pendingForValidate,
            // incompleteAmount,
            daysLate,
            daysExpired,
            paymentClientNumber,
            paymentClientAmount,
            clientPoints: client.points,
            createdBy: this.formatReturnClientData(client.createdBy).fullname || null,
          }
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public recalculateLastContract = async (clientId: string) => {

    const client = await this.userModel.findOne({ _id: clientId }).populate('createdBy')

    if(!client) {
      throw new BadRequestException(`Cliente incorrecto`)
    }

    const allContractsByUser = await this.contractModel
        .find({ client: clientId })
        .sort({ createdAt: 'asc' })
        .populate('createdBy')
        .populate('paymentList')
        .populate('movementList')

    const contractsByUser = allContractsByUser.filter((contract) => contract.status)

    const now = dayjs.tz()
    const lastContract = contractsByUser[0];
    const paymentDays: any[] = [];

    const contractInitDate = dayjs(lastContract.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()

    const { paymentList, movementList, paymentAmount, payments, nonWorkingDays } = lastContract

    const holidays = await this.holidayModel.find()
    const holidaysDates = holidays.map((date) => date.holidayDate)

    let paymentsIndex = 0
    while (paymentDays.length < payments) {
      const date = contractInitDate.add(paymentsIndex, 'day')
      const day = date.day()
      const parsedDay = this.parseDay(day)
      const isSameContractDate = date.isSame(contractInitDate)
      let isPayDay = !nonWorkingDays?.includes(parsedDay) && !isSameContractDate

      const formattedDate = date.format('DD/MM/YYYY')
      const isHoliday = holidaysDates?.includes(formattedDate)

      if(isHoliday) {
        isPayDay = false
      }

      if(isPayDay) {
        paymentDays.push(date)
      }

      paymentsIndex++
    }
    
    const paymentsToDelete = paymentList.map((pay) => pay.id)

    // How much client payed
    const payed = movementList.reduce((amount, movement) => amount + movement.amount, 0)
    const newPayments = []

    let paymentNumber = 1
    for (let index = 0; index < movementList.length; index++) {
      const movement = movementList[index];

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
          lastContract.paymentList.push(created)
          await lastContract.save()
        }
      } catch (error) {
        console.log("🚀 ~ file: contracts.service.ts:755 ~ ContractsService ~ recalculateLastContract= ~ error:", error)
        throw new Error(error)
      }
    }
    
    return { data: 'ok' }
  }

  public findOne = async (search: string) => {
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

  public contractsFromToday = async (userRequest: User) => {

    const role = userRequest.role?.name

    if(!role || !['root', 'admin'].includes(role) ) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }

    const today = dayjs.tz().format('DD/MM/YYYY')

    try {

      const contracts = await this.contractModel.find({ lastContractDate: today })
        .sort({ createdAt: 'asc' })
        .populate('createdBy')
        .populate('client')
        
      return {
        data: contracts.map((contract) => this.formatReturnData(contract)),
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public cancelContract= async (id: string, userRequest: User) => {
    
    const role = userRequest.role?.name

    if(!role || !['root', 'admin'].includes(role) ) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }
    try {
      const contract = await this.contractModel.findById(id)
        .populate('paymentList')
        .populate('movementList')
        .populate('client')

      if(!contract) {
        throw new NotFoundException(`Contract with id "${ id }" not found`)
      }
      await this.deleteMovementsAndPayments({ contract })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
