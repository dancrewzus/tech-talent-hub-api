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

dayjs.tz.setDefault('America/Caracas')

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
  ]

  public getUsers = () => [
    {
      email: 'adumbledore@howarts.magic',
      password: 'ADumbledore_1881',
      role: 'collector',
      gender: 'system',
      firstName: 'Albus',
      secondName: 'Percival',
      paternalSurname: 'Dumbledore',
      maternalSurname: '',
      birthDate: '01/08/1881',
      address: 'Hogwarts',
      phoneNumber: '123456789',
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      email: 'hpotter@howarts.magic',
      password: 'Nimbus_2000',
      role: 'client',
      gender: 'system',
      firstName: 'Harry',
      secondName: '',
      paternalSurname: 'Potter',
      maternalSurname: '',
      birthDate: '31/07/1980',
      address: 'Privet Drive Nro. 4',
      phoneNumber: '123456789',
      createdAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
      updatedAt: this.now.format('DD/MM/YYYY HH:mm:ss'),
    },
  ]
  
}