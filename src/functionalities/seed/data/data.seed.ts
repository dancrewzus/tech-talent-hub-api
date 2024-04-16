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

dayjs.tz.setDefault('America/Bogota')

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
      email: 'root@retmies.com',
      cpf: '123456789',
      password: 'ROOTrentmies_24',
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
  ]
  
}