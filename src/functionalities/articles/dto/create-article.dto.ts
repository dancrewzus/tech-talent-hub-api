import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateArticleDto {
  
  @ApiProperty({ type: String, description: 'Article ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id: string;
  
  @ApiProperty({ type: String, description: 'Article author', example: 'John Doe' })
  @IsString()
  author: string;
  
  @ApiProperty({ type: String, description: 'Article title', example: 'The Future of Artificial Intelligence' })
  @IsString()
  title: string;
  
  @ApiProperty({ type: String, description: 'Article slug', example: 'the-future-of-artificial-intelligence' })
  @IsString()
  slug: string;
  
  @ApiProperty({ type: String, description: 'Article content', example: 'Artificial Intelligence (AI) is rapidly changing the world...' })
  @IsString()
  content: string;

  @ApiProperty({ type: [ String ], description: 'Array of article tags', example: ['AI', 'Technology', 'Future'] })
  @IsArray()
  tags: string[];

  @ApiProperty({ type: String, description: 'Article category', example: 'Technology' })
  @IsString()
  category: string;

  @ApiProperty({ type: String, description: 'Article area', example: 'Computer Science' })
  @IsString()
  area: string;

  @ApiProperty({ type: Number, description: 'Number of likes', example: 150 })
  @IsNumber()
  @IsPositive()
  likes: number;

  @ApiProperty({ type: Boolean, description: 'Article is featured', example: true })
  @IsBoolean()
  isFeatured: boolean;

  @ApiProperty({ type: String, description: 'Article summary', example: 'This article discusses the impact of AI on society.' })
  @IsString()
  summary: string;

  @ApiProperty({ type: String, description: 'Article creation date - Format YYYY-MM-DD.', example: '2023-04-15' })
  @IsDateString()
  createdAt: string;

  @ApiProperty({ type: String, description: 'Article last update date - Format YYYY-MM-DD.', example: '2023-04-15' })
  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}