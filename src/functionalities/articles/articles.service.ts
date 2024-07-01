import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "@nestjs/mongoose"
import { PaginateModel, Model, isValidObjectId, PaginateOptions } from "mongoose"

import { DayJSAdapter } from "src/common/adapters/dayjs.adapter"
import { HandleErrors } from "src/common/utils/handleErrors.util"
import { Category } from "../categories/entities/category.entity"
import { CreateArticleDto } from "./dto/create-article.dto"
import { error } from 'src/common/constants/error-messages'
import { Track } from "../tracks/entities/track.entity"
import { Article } from "./entities/article.entity"
import { User } from "../users/entities/user.entity"
import { Utils } from "src/common/utils/utils"

@Injectable()
export class ArticlesService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Category.name, 'default') private readonly categoryModel: PaginateModel<Category>,
    @InjectModel(Article.name, 'default') private readonly articleModel: PaginateModel<Article>,
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    private readonly configService: ConfigService,
    private readonly handleErrors: HandleErrors,
    private readonly dayjs: DayJSAdapter,
    private readonly utils: Utils,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) {
      return 'id'
    }
    if(this.utils.isValidSlug(`${ search }`)) {
      return 'slug'
    }
    return 'invalid'
  }

  private findArticle = async (search: string): Promise<Article> => {
    try {
      let article: Article;
      const searchTypeResponse = this.searchType(search)
      switch (searchTypeResponse) {
        case 'id':
          article = await this.articleModel.findById(search)
                  .populate('createdBy')
          break;
        case 'slug':
          article = await this.articleModel.findOne({ slug: search.toLocaleLowerCase() })
                  .populate('createdBy')
          break;
        default:
          article = null;
          break;
      }
      if(!article) {
        throw new NotFoundException(`Article with ${ searchTypeResponse } "${ search }" not found`)
      }
      return article;
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public create = async (createArticleDto: CreateArticleDto, userRequest: User, clientIp: string): Promise<Article> => {
    try {
      const { title, category, ...restOfData } = createArticleDto
      const categoryDb = await this.categoryModel.findById(category)
      if(!categoryDb) {
        throw new NotFoundException(`Category with id "${ category }" not found`)
      }
      const slug = this.utils.convertToSlug(title)
      const article = await this.articleModel.create({
        title,
        slug,
        createdBy: userRequest.id,
        createdAt: this.dayjs.getCurrentDateTime(),
        updatedAt: this.dayjs.getCurrentDateTime(),
        ...restOfData
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `Article ${ article._id } was created.`,
        module: 'Articles',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return article
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findArticles = async (paginationDto: any) => {
    const { limit, offset, filter } = paginationDto ? JSON.parse(paginationDto) : { limit: this.defaultLimit, offset: 0, filter: '' };
    const setOffset = offset === undefined ? 0 : offset
    const setLimit = limit === undefined ? this.defaultLimit : limit
    const isSearch = filter !== '' ? true : false
    try {
      const options: PaginateOptions = {
        offset: setOffset,
        limit: setLimit,
        populate: [
          {
            path: 'createdBy'
          }
        ],
        sort: { createdAt: 1 },
        customLabels: {
          meta: 'pagination'
        }
      };        
      let data: any = {
        deleted: false
      }
      if(isSearch) {
        data = {
          $or: [
            { 
              slug: new RegExp(filter, 'i'),
              deleted: false
            },
            { 
              title: new RegExp(filter, 'i'),
              deleted: false
            },
          ]
        }
      }
      const articles = await this.articleModel.paginate(data, options)
      return {
        data: {
          pagination: articles?.pagination || {},
          articles: articles?.docs.map((articles) => articles),
        }
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findOne = async (search: string): Promise<Article> => {
    try {
      return this.findArticle(search)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public update = async (id: string, updateArticleDto: CreateArticleDto, userRequest: User, clientIp: string): Promise<object> => {
    try {
      const article = await this.articleModel.findById(id)
      if(!article) {
        throw new NotFoundException(error.ARTICLE_NOT_FOUND)
      }
      const { title, content } = updateArticleDto
      const slug = this.utils.convertToSlug(title)
      Object.assign(article, {
        ...updateArticleDto,
        slug,
        updatedAt: this.dayjs.getCurrentDateTime()
    })
      await article.save()
      await this.trackModel.create({
        ip: clientIp,
        description: `Article ${ article._id } was updated: ${ JSON.stringify({ title, slug, content }) }.`,
        module: 'Articles',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return article
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public remove = async (id: string, userRequest: User, clientIp: string) => {
    try {
      const article = await this.articleModel.findById(id)
      if(!article) {
        throw new NotFoundException(error.ARTICLE_NOT_FOUND)
      }
      await article.updateOne({ 
        deleted: true,
        updatedAt: this.dayjs.getCurrentDateTime(),
        deletedAt: this.dayjs.getCurrentDateTime()
      });
      await this.trackModel.create({
        ip: clientIp,
        description: `Article ${ article._id } was deactivated.`,
        module: 'Articles',
        createdAt: this.dayjs.getCurrentDateTime(),
        user: userRequest.id
      })
      return
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}