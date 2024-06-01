import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, IsNumber } from 'class-validator'

export class CreateOfferDto {
    @ApiProperty(uniqueItems: true)
    @IsString()
    title: string

    @IsString()
    position: string

    @IsNumber()
    yearsOfExperience: number

    @IsString()
    contract: string

    @IsString()
    keywords: string

    @IsNumber()
    salary: number

    @IsString()
    hiringDate: string

    @IsBoolean()
    status: boolean
}
