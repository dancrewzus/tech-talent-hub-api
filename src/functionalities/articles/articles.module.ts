import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Article, ArticleSchema } from './entities/article.entity';
import { Track, TrackSchema } from '../tracks/entities/track.entity';
import { ArticlesController } from './articles.controller';
import { CommonModule } from '../../common/common.module';
import { ArticlesService } from './articles.service';
import { AuthModule } from 'src/auth/auth.module';
import { Category, CategorySchema } from '../categories/entities/category.entity';

@Module({
  controllers: [ ArticlesController ],
  providers: [ ArticlesService ],
  imports: [
    AuthModule,
    ConfigModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema
      },
      {
        name: Category.name,
        schema: CategorySchema
      },
    ], 'default')
  ], 
  exports: [ ArticlesService ]
})
export class ArticlesModule {}