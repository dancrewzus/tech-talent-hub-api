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
      cpf: '123456789',
      password: 'ROOTimperial_23',
      role: 'root',
      gender: 'system',
      firstName: 'Root',
      secondName: '',
      paternalSurname: 'Superuser',
      maternalSurname: '',
      birthDate: '01/01/1900',
      profilePicture: '',
      residenceAddress: 'Privet Drive Nro. 4',
      billingAddress: 'Hogwarts',
      phoneNumber: '123456789',
    },
    {
      email: 'adumbledore@howarts.magic',
      cpf: '123456780',
      password: 'ADumbledore_1881',
      role: 'collector',
      gender: 'system',
      firstName: 'Albus',
      secondName: 'Percival',
      paternalSurname: 'Dumbledore',
      maternalSurname: '',
      birthDate: '01/08/1881',
      profilePicture: '',
      residenceAddress: 'Privet Drive Nro. 4',
      billingAddress: 'Hogwarts',
      phoneNumber: '123456789',
    },
    {
      email: 'hpotter@howarts.magic',
      cpf: '123456781',
      password: 'Nimbus_2000',
      role: 'client',
      gender: 'system',
      firstName: 'Harry',
      secondName: '',
      paternalSurname: 'Potter',
      maternalSurname: '',
      birthDate: '31/07/1980',
      profilePicture: '',
      residenceAddress: 'Privet Drive Nro. 4',
      billingAddress: 'Hogwarts',
      phoneNumber: '123456789',
    },
  ]
  
}