import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class SeedData {

  private logger

  constructor() {
    this.logger = new Logger('Seed Data')
  }

  public getRoles = () => [
    {
      name: 'root',
      primary: false,
      status: true,
    },
    {
      name: 'admin',
      primary: false,
      status: true,
    },
    {
      name: 'client',
      primary: true,
      status: true,
    },
    {
      name: 'collector',
      primary: false,
      status: true,
    },
  ]

  public getUsers = () => [
    {
      email: 'root@imperial.pronto',
      cpf: '12.345.678-9',
      password: 'ROOTimperial_23',
      role: 'root',
    },
    {
      email: 'adumbledore@howarts.magic',
      cpf: '12.345.678-0',
      password: 'ADumbledore_1881',
      role: 'collector',
    },
    {
      email: 'hpotter@howarts.magic',
      cpf: '12.345.678-1',
      password: 'Nimbus_2000',
      role: 'client',
    },
  ]

  public getUsersData = () => [
    {
      firstName: 'Root',
      secondName: '',
      paternalSurname: 'Superuser',
      maternalSurname: '',
      birthDate: '01/01/1900',
      profilePicture: '',
      residenceAddress: 'Privet Drive Nro. 4',
      billingAddress: 'Hogwarts',
      phoneNumber: '123456789',
      user: null,
    },
    {
      firstName: 'Albus',
      secondName: 'Percival',
      paternalSurname: 'Dumbledore',
      maternalSurname: '',
      birthDate: '01/08/1881',
      profilePicture: '',
      residenceAddress: 'Privet Drive Nro. 4',
      billingAddress: 'Hogwarts',
      phoneNumber: '123456789',
      user: null,
    },
    {
      firstName: 'Harry',
      secondName: '',
      paternalSurname: 'Potter',
      maternalSurname: '',
      birthDate: '31/07/1980',
      profilePicture: '',
      residenceAddress: 'Privet Drive Nro. 4',
      billingAddress: 'Hogwarts',
      phoneNumber: '123456789',
      user: null,
    },
  ]
  
}