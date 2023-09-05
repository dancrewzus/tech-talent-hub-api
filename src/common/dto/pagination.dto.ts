import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class PaginationDto {
  
  @ApiProperty({
    example: 10,
    default: 10,
    description: 'Pagination limit',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  public limit?: number;
  
  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Pagination offset',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  public offset?: number;

  @ApiProperty({
    example: 'idepixel',
    default: '',
    description: 'Pagination filter',
    required: false,
  })
  @IsOptional()
  @IsString()
  public filter?: string;
}