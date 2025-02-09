import { Injectable, Logger } from "@nestjs/common"

import { DayJSAdapter } from "src/common/adapters/dayjs.adapter"

@Injectable()
export class SeedData {

  private logger

  constructor(
    private readonly dayjs: DayJSAdapter,
  ) {
    this.logger = new Logger('Seed Data')
  }

  public getRoles = () => [
    {
      name: 'root',
      primary: false,
      status: true,
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
    },
    {
      name: 'admin',
      primary: false,
      status: true,
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
    },
    {
      name: 'client',
      primary: true,
      status: true,
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
    },
  ]

  public getUsers = () => [
    {
      email: 'adumbledore@howarts.magic',
      password: 'ADumbledore_1881',
      role: 'root',
      gender: 'system',
      name: 'Albus',
      surname: 'Dumbledore',
      birthDate: '01/08/1881',
      address: 'Hogwarts',
      phoneNumber: '654789321',
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
    },
    {
      email: 'mmcgonagall@howarts.magic',
      password: 'Animaga_1935',
      role: 'admin',
      gender: 'female',
      name: 'Minerva',
      surname: 'McGonagall',
      birthDate: '04/10/1935',
      address: 'Caithness, Scotland',
      phoneNumber: '987654321',
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
    },
    {
      email: 'hpotter@howarts.magic',
      password: 'Nimbus_2000',
      role: 'client',
      gender: 'male',
      name: 'Harry',
      surname: 'Potter',
      birthDate: '31/07/1980',
      address: 'Privet Drive Nro. 4',
      phoneNumber: '123456789',
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
    },
    {
      email: 'triddle@howarts.magic',
      password: 'IAmVoldemort',
      role: 'client',
      gender: 'male',
      name: 'Tom',
      surname: 'Riddle',
      birthDate: '31/12/1926',
      address: 'Albania Dark Forest',
      phoneNumber: '456456456',
      createdAt:this.dayjs.getCurrentDateTime(),
      updatedAt:this.dayjs.getCurrentDateTime(),
      isActive: false,
    },
  ]
  
}