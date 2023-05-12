import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  public limit?: number;
  
  @IsOptional()
  @IsPositive()
  @IsNumber()
  public offset?: number;
}