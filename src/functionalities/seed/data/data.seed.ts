import { Injectable, Logger } from "@nestjs/common"

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

@Injectable()
export class SeedData {

  private logger
  private now = dayjs.tz()

  constructor() {
    this.logger = new Logger('Seed Data')
  }

  public getRoles = () => [
    {
      name: 'root',
      primary: false,
      status: true,
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      name: 'admin',
      primary: false,
      status: true,
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      name: 'client',
      primary: true,
      status: true,
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      name: 'collector',
      primary: false,
      status: true,
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
  ]

  public getUsers = () => [
    {
      email: 'root@imperial.pronto',
      cpf: '123456789',
      password: 'ROOTimperial_23',
      role: 'root',
      gender: 'system',
      firstName: 'Super',
      secondName: '',
      paternalSurname: 'User',
      maternalSurname: '',
      birthDate: '01/01/1900',
      residenceAddress: 'Amin',
      billingAddress: 'Amin',
      phoneNumber: 'Admin',
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
    // {
    //   email: 'root@imperial.pronto',
    //   cpf: '123456789',
    //   password: 'ROOTimperial_23',
    //   role: 'root',
    //   gender: 'system',
    //   firstName: 'Root',
    //   secondName: '',
    //   paternalSurname: 'Superuser',
    //   maternalSurname: '',
    //   birthDate: '01/01/1900',
    //   residenceAddress: 'Privet Drive Nro. 4',
    //   billingAddress: 'Hogwarts',
    //   phoneNumber: '123456789',
    //   createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    //   updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    // },
    // {
    //   email: 'adumbledore@howarts.magic',
    //   cpf: '123456780',
    //   password: 'ADumbledore_1881',
    //   role: 'collector',
    //   gender: 'system',
    //   firstName: 'Albus',
    //   secondName: 'Percival',
    //   paternalSurname: 'Dumbledore',
    //   maternalSurname: '',
    //   birthDate: '01/08/1881',
    //   residenceAddress: 'Privet Drive Nro. 4',
    //   billingAddress: 'Hogwarts',
    //   phoneNumber: '123456789',
    //   createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    //   updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    // },
    // {
    //   email: 'hpotter@howarts.magic',
    //   cpf: '123456781',
    //   password: 'Nimbus_2000',
    //   role: 'client',
    //   gender: 'system',
    //   firstName: 'Harry',
    //   secondName: '',
    //   paternalSurname: 'Potter',
    //   maternalSurname: '',
    //   birthDate: '31/07/1980',
    //   residenceAddress: 'Privet Drive Nro. 4',
    //   billingAddress: 'Hogwarts',
    //   phoneNumber: '123456789',
    //   createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    //   updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    // },
  ]
  
}