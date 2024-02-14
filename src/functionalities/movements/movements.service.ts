import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { ContractsService } from '../contracts/contracts.service';
import { CloudAdapter } from 'src/common/adapters/cloud.adapter';
import { PaymentsService } from '../payments/payments.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Payment } from '../payments/entities/payment.entity';
import { Geolocation } from './entities/location.entity';
import { Image } from '../images/entities/image.entity';
import { Movement } from './entities/movement.entity';
import { Role } from '../roles/entities/role.entity';
import { BSON } from 'mongodb';

@Injectable()
export class MovementsService {

  private defaultLimit: number;

  private capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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

  private formatReturnWorkerData = (user: User) => {
    return {
      id: user.id,
      fullname: `${ this.capitalizeFirstLetter(user.firstName) } ${ this.capitalizeFirstLetter(user.paternalSurname) }` || '',
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
    @InjectModel(Geolocation.name, 'default') private readonly locationModel: Model<Geolocation>,
    @InjectModel(Contract.name, 'default') private readonly contractModel: Model<Contract>,
    @InjectModel(Movement.name, 'default') private readonly movementModel: Model<Movement>,
    @InjectModel(Payment.name, 'default') private readonly paymentModel: Model<Payment>,
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    @InjectModel(Role.name, 'default') private readonly roleModel: Model<Role>,
    @InjectModel(User.name, 'default') private readonly userModel: Model<User>,
    private readonly contractsService: ContractsService,
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
    private readonly cloudAdapter: CloudAdapter,
    private readonly handleErrors: HandleErrors,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private recalculateLastContract = async (clientId: string) => {

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

        movement.paymentList = []
        await movement.save()
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
      } catch (error) {
        console.log("🚀 ~ file: contracts.service.ts:755 ~ ContractsService ~ recalculateLastContract= ~ error:", error)
        throw new Error(error)
      }
    }
    
    return { data: 'ok' }
  }

  private deleteMovementsAndPayments = async ({ contract, movement }) => {
    try {

      const { paymentList: paymentContractList, movementList: movementContractList } = contract
      const { paymentList } = movement

      // Delete payment list from contract
      const newContractPaymentList = []
      paymentContractList.forEach((payment) => {
        const exist = paymentList.find((pay) => pay.id === payment.id)
        if(!exist) {
          newContractPaymentList.push(payment)
        }
      });
      contract.paymentList = newContractPaymentList

      // Delete payment list
      for (let index = 0; index < paymentList.length; index++) {
        const payment = paymentList[index];
        await payment.deleteOne()
      }

      // Delete movement from contract
      const newContractMovementList = []
      movementContractList.forEach((mov) => {
        if(mov.id !== movement.id) {
          newContractMovementList.push(mov)
        }
      });
      contract.movementList = newContractMovementList

      // const { paymentPicture } = movement
      // await this.cloudAdapter.deleteResource(paymentPicture.publicId)

      // await paymentPicture.deleteOne()
      await movement.deleteOne()
      await contract.save()

      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public create = async (createMovementsDto: CreateMovementDto, userRequest: User) => {
    
    const role = userRequest.role?.name

    if(!role || (!['root', 'admin'].includes(role) && createMovementsDto.type === 'final')) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }

    try {
      const now = dayjs.tz()
      const haveFinal = await this.movementModel.findOne({ type: 'final', movementDate: now.format('DD/MM/YYYY'), createdBy: userRequest.id })

      if(haveFinal) {
        throw {
          code: 3000,
          message: 'No es posible registrar más movimientos, verifique mañana',
        }
      }

      const {
        amount,
        type,
        comment,
        createdBy,
        description,
        paymentPicture,
      } = createMovementsDto

      let databasePicture = null
      if(paymentPicture !== '') {
        databasePicture = await this.imageModel.findOne({ _id : paymentPicture })
        if(!databasePicture) {
          throw new NotFoundException(`No es posible encontrar la imagen con ID "${ paymentPicture }"`)
        }
      }

      await this.movementModel.create({
        createdBy: createdBy && createdBy !== 'general' ? createdBy : userRequest.id,
        status: 'validated',
        validatedBy: userRequest.id,
        amount,
        type,
        comment,
        description,
        paymentPicture: databasePicture?.id || null,
        movementDate: now.format('DD/MM/YYYY'),
        createdAt: now.format('DD/MM/YYYY HH:mm:ss'),
        updatedAt: now.format('DD/MM/YYYY HH:mm:ss'),
      });

      return;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public dailyResume= async (id: string, userRequest: User) => {
    try {
      const today = dayjs.tz().format('DD/MM/YYYY')

      const role = userRequest.role?.baseModelName
      let workers: any[] = []

      if(['root', 'admin'].includes(role)) {
        const workerRole = await this.roleModel.findOne({ name: 'collector' })
        workers = await this.userModel.find({ role: workerRole._id })
      }


      // Movements related

      const movements = id === 'general' 
        ? await this.movementModel.find().sort({ createdAt: 'asc' }).populate('paymentPicture')
        : await this.movementModel.find({ createdBy: id }).sort({ createdAt: 'asc' }).populate('paymentPicture')

      const incomesMovementsFromToday = []
      const expensesMovementsFromToday = []
      const comments = []

      let haveFinalMovement = false
      let movementsCollected = 0
      let expensesAmount = 0
      let incomesAmount = 0
      let beforeAmount = 0
      let todayAmount = 0

      let amountCollected = 0

      movements.forEach((movement) => {

        const isFromToday = movement.movementDate === today

        switch (movement.type) {

          case 'final':
            if(id !== 'general' && movement.comment !== '') comments.push({ id: movement.id, comment: movement.comment })
            if(isFromToday) haveFinalMovement = true
            break;
          
          case 'in':
            if(movement.status === 'validated') {
              if(!isFromToday) beforeAmount += movement.amount
              else {
                todayAmount += movement.amount
                incomesMovementsFromToday.push(this.formatReturnMovementData(movement))
  
                if(!movement.description.includes('[Abono]: ')) {
                  incomesAmount += movement.amount  
                } else {
                  amountCollected += movement.amount  
                }
              }
            }
            break;

          case 'out':
            if(!isFromToday) beforeAmount -= movement.amount
            else {
              todayAmount -= movement.amount
              expensesMovementsFromToday.push(this.formatReturnMovementData(movement))

              if(!movement.description.includes('[Nuevo contrato]: ')) {
                expensesAmount += movement.amount  
              }
            }
            break;

          default: break;
        }
      });

      todayAmount += beforeAmount

      // Contracts related

      const activeContracts = id === 'general'
        ? await this.contractModel
          .find({ status: true })
          .sort({ createdAt: 'asc' })
          .populate('paymentList')
          .populate('movementList')
        : await this.contractModel
          .find({ status: true, createdBy: id })
          .sort({ createdAt: 'asc' })
          .populate('paymentList')
          .populate('movementList')

      let amountToBeCollected = 0
      let amountContractsFromToday = 0

      let regularContractsFromToday = 0
      let paymentsToBeCollected = 0
      let contractsFromToday = 0
      let paymentsCollected = 0
        
      for (let i = 0; i < activeContracts.length; i++) {

        const contract = activeContracts[i];
        const client = await this.userModel.findById(contract.client)

        if(client && client.isActive) {
          const contractsCount = await this.contractModel.find({ client: contract.client }).count()
          const contractInitDate = dayjs(contract.createdAt, 'DD/MM/YYYY HH:mm:ss').tz()
  
          const movementList = contract.movementList.filter((movement) => movement.movementDate === today && movement.description.includes('[Abono]') && movement.status === 'validated') || []
          movementsCollected += movementList.length
          
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
                
                const havePaymentsByDate = havePayments ? paymentList?.filter((payment) => payment.paymentDate === today && payment.status) : null
                
                if(havePaymentsByDate && havePaymentsByDate.length) {
                  paymentsCollected++
                }
              }
            }
  
  
            index++
          }
  
          if(contractInitDate.format('DD/MM/YYYY') === today) {
            amountContractsFromToday += contract.loanAmount
            if(contractsCount === 1) {
              contractsFromToday++
            } else {
              regularContractsFromToday++
            }
          }
        } else {
          contract.status = false
          await contract.save()
        }
      }

      return {
        movementsFromToday: { incomesMovementsFromToday, expensesMovementsFromToday },
        closed: haveFinalMovement,
        regularContractsFromToday,
        amountContractsFromToday,
        paymentsToBeCollected,
        amountToBeCollected,
        movementsCollected,
        contractsFromToday,
        paymentsCollected,
        amountCollected,
        expensesAmount,
        incomesAmount,
        beforeAmount,
        todayAmount,
        comments,
        workers: workers.map((worker) => this.formatReturnWorkerData(worker))
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
  
  public pending = async (userRequest: User) => {

    const role = userRequest.role?.name

    if(!role || !['root', 'admin', 'collector'].includes(role)) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }

    const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)

    try {
      let movements = []
      const allMovements = await this.movementModel.find({ status: 'pending' }).sort({ createdAt: 'asc' }).populate('paymentPicture').populate('contract')
      
      if(!isAdmin) {
        const contracts = await this.contractModel.find({ 
          status: true, 
          createdBy: userRequest.id,
        }).select('id')
        const contractsIds = contracts.map(c => c.id)
        movements = allMovements.filter((mov) => contractsIds.includes(mov.contract.id))

      } else {
        movements = allMovements
      }
      
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
  
  public pendingCount = async (userRequest: User) => {

    // const role = userRequest.role?.name

    // if(!role || !['root', 'admin'].includes(role)) {
    //   this.handleErrors.handleExceptions({
    //     code: 401,
    //     message: 'No tienes permisos para realizar esta acción.'
    //   })
    // }

    const isAdmin = ['root', 'admin'].includes(userRequest?.role?.name)

    try {
      let movements = []
      const allMovements = await this.movementModel.find({ status: 'pending' }).populate('contract')
      
      if(!isAdmin) {
        const contracts = await this.contractModel.find({ 
          status: true, 
          createdBy: userRequest.id,
        }).select('id')
        const contractsIds = contracts.map(c => c.id)
        movements = allMovements.filter((mov) => contractsIds.includes(mov.contract.id))

      } else {
        movements = allMovements
      }

      return {
        data: movements.length,
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public movementsFromToday = async (type: string, userRequest: User) => {

    const role = userRequest.role?.name

    if(!role || !['root', 'admin'].includes(role) ) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }

    const today = dayjs.tz().format('DD/MM/YYYY')

    try {

      const mappedType = type !== 'expense' ? 'in' : 'out'
      const movements = await this.movementModel.find({ type: mappedType, movementDate: today })
        .sort({ createdAt: 'asc' })
        .populate('paymentPicture')


      let filteredMovements: any[] = []

      switch (type) {
        case 'payment':
          filteredMovements = movements.filter((movement) => movement.description.includes('[Abono]: '))
          break;
        
        case 'income':
          filteredMovements = movements.filter((movement) => !movement.description.includes('[Abono]: '))
          break;
      
        default:
          filteredMovements = movements
          break;
      }

      return {
        data: filteredMovements.map((movement) => this.formatReturnMovementData(movement)),
      }

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public validateMovement= async (data: any, userRequest: User) => {
    
    const role = userRequest.role?.name

    if(!role || !['root', 'admin', 'collector'].includes(role) ) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }

    const { id } = data

    try {
      const movement = await this.movementModel.findById(id).populate('paymentList').populate('paymentPicture').populate('contract')
      if(!movement) {
        throw new NotFoundException(`Payment with id "${ id }" not found`)
      }

      const { paymentList, contract } = movement

      const contractExist = await this.contractModel
        .findOne({ _id: contract._id, status: true })
        .populate('client')
        .populate('paymentList')

      for (let index = 0; index < paymentList.length; index++) {
        const payment = paymentList[index];
        payment.status = true
        await payment.save()
      }
      movement.status = 'validated'
      await movement.save()

      // Validate if contract is all payed

      const clientId = new BSON.ObjectId( contractExist?.client?._id )
      const clientExist = await this.userModel.findById(clientId)
      // console.log("🚀 ~ file: movements.service.ts:513 ~ MovementsService ~ validateMovement= ~ clientExist:", clientExist)

      if(!contractExist || !clientExist) {
        throw new BadRequestException(`Ha ocurrido un error al encontrar el contrato o cliente`)
      }

      let payments = 0
      for(const payment of contractExist?.paymentList) {
        payments = payments + payment.amount
      }

      if(!contractExist.isOutdated && payments === contractExist.totalAmount) {
        contractExist.status = false
        clientExist.points = clientExist.points + 1
        await contractExist.save()
        await clientExist.save()
      }

      return

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public cancelMovement= async (id: string, userRequest: User) => {
    
    const role = userRequest.role?.name

    if(!role || !['root', 'admin'].includes(role) ) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }
    try {
      const movement = await this.movementModel.findById(id).populate('paymentList').populate('paymentPicture')
      if(!movement) {
        throw new NotFoundException(`Payment with id "${ id }" not found`)
      }
      if(movement.contract) {
        const contract = await this.contractModel.findById(movement.contract)
          .populate('paymentList')
          .populate('movementList')
          .populate('client')
  
        await this.deleteMovementsAndPayments({ contract, movement })
        await this.recalculateLastContract(contract.client?._id)
      } else {
        const { paymentPicture } = movement
        await this.cloudAdapter.deleteResource(paymentPicture.publicId)

        await paymentPicture.deleteOne()
        await movement.deleteOne()
      }
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public deleteComment= async (id: string, userRequest: User) => {
    
    const role = userRequest.role?.name

    if(!role || !['root', 'admin'].includes(role) ) {
      this.handleErrors.handleExceptions({
        code: 401,
        message: 'No tienes permisos para realizar esta acción.'
      })
    }

    try {
      const movement = await this.movementModel.findById(id)
      if(!movement) {
        throw new NotFoundException(`Payment with id "${ id }" not found`)
      }
      movement.comment = ''
      await movement.save()
      return

    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}


// IN VALIDATE MOVEMENT

/**
       * ESTA CONDICIÓN APLICA PARA EDITAR EL MONTO DEL
       * MOVIMIENTO Y RECALCULAR TODOS LOS PAGOS
       */
      // if(amount !== movement.amount) {

        /**
         * TEMPORALMENTE DESHABILITADO!!!
         */
        // // Crea una copia del movimiento
        // const movementForDelete = JSON.parse(JSON.stringify(movement))
        
        // // Obtiene el contrato para editar junto con el movimiento
        // const contractToEdit = await this.contractModel.findById(movementForDelete.contract)
        //   .populate('client')
        //   .populate('paymentList')
        //   .populate('movementList')

        // if(!contractToEdit) {
        //   throw new NotFoundException(`Contrato no encontrado`)
        // }

        // // Edita el contrato y elimina los pagos y el movimiento
        // await this.deleteMovementsAndPayments({ contract: contractToEdit, movement })
        
        // /**
        //  * A partir de acá comienza el nuevo cálculo del movimiento y pagos
        // */

        // const paymentPicture = await this.imageModel.findById(movementForDelete.paymentPicture._id)
        // const paymentClientAmount = amount
        // /**
        //  * Código obtenido desde la API de contratos
        //  */
        
        // const lastContractData = await this.contractsService.findLastContract(contractToEdit.client.id)

        // const { lastContract, paymentIncompleteDays, paymentDays, patchValue } = lastContractData.data
        // const { paymentClientNumber } = patchValue

        // /**
        //  * Código obtenido desde el frontend de detalle de contratos
        //  */
        // const groupByDate = []
        // lastContract.paymentList.forEach((pay) => {
        //   const payment = JSON.parse(JSON.stringify(pay))
        //   const index = groupByDate.findIndex((pay) => pay.paymentDate === payment.paymentDate)
        //   if(index === -1) {
        //     groupByDate.push(payment)
        //   } else {
        //     const groupedPayment = groupByDate[index]
        //     groupedPayment.amount = groupedPayment.amount + payment.amount
        //     groupedPayment.status = !groupedPayment.status ? !groupedPayment.status : payment.status
        //     groupByDate[index] = groupedPayment
        //   }
        // })

        // let pendingAmount = 0
        // groupByDate.forEach((payment) => {
        //   pendingAmount += (amount - payment.amount)
        // });

        // const paymentsToStore: any[] = []
        // if(paymentClientAmount > lastContract.paymentAmount || (pendingAmount > 0 && paymentClientAmount > pendingAmount)) {

        //   const incompleteDays = paymentIncompleteDays?.length || 0

        //   let paymentAmount = paymentClientAmount
        //   let index = 0

        //   while(paymentAmount > 0) {
        //     let payed = 0
        //     const paymentDay = dayjs(paymentDays[(paymentClientNumber - 1) + index]).tz().format('DD/MM/YYYY')
        //     if(incompleteDays) {
        //       const exist = paymentIncompleteDays.includes(paymentDay)
        //       if(!exist) {
        //         payed = paymentAmount < amount ? paymentAmount : amount
        //       } else {
        //         let value = 0
        //         const payments = groupByDate.filter((payment) => payment.paymentDate === paymentDay)
        //         payments.forEach((el) => {
        //           value += el.amount
        //         })
        //         payed = amount - value
        //       }
        //     } else {
        //       payed = paymentAmount < amount ? paymentAmount : amount
        //     }
        //     const payment = {
        //       client: lastContract.client,
        //       contract: lastContract.id,
        //       paymentDate: paymentDay,
        //       paymentNumber: paymentClientNumber + index,
        //       amount: `${ payed }`,
        //       paymentPicture: paymentPicture._id,
        //     }

        //     paymentsToStore.push(payment)

        //     paymentAmount = paymentAmount - payed
        //     index++
        //   }
        // } else {
        //   const paymentDay = dayjs(paymentDays[data.paymentClientNumber - 1])
        //   paymentsToStore.push({
        //     client: lastContract.client,
        //     contract: lastContract.id,
        //     paymentDate: paymentDay.format('DD/MM/YYYY'),
        //     paymentNumber: paymentClientNumber,
        //     amount: paymentClientAmount,
        //     paymentPicture: paymentPicture._id,
        //   })
        // }

        // /**
        //  * Graba los pagos calculados y el movimiento
        //  */

        // await this.paymentsService.create(paymentsToStore, userRequest)

      // } else {
        
      //   const { paymentList } = movement

      //   for (let index = 0; index < paymentList.length; index++) {
      //     const payment = paymentList[index];
      //     payment.status = true
      //     await payment.save()
      //   }
      //   movement.status = 'validated'
      //   await movement.save()
      // }