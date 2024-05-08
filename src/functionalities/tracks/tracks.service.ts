import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';

import { HandleErrors } from '../../common/utils/handleErrors.util';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Track.name, 'default') private readonly trackModel: Model<Track>,
    private readonly handleErrors: HandleErrors,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  private searchType = (search: string | number): string => {
    if(isValidObjectId(search)) return 'id'
    if(!isNaN(Number(search))) return 'number'
    if(isNaN(Number(search))) return 'name'
    return 'invalid'
  }

  public findAll = async (paginationDto: PaginationDto) => {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    try {
      return await this.trackModel.find({
          name: { $nin: [ 'root', 'client' ]}
        })
        .limit( limit )
        .skip( offset )
        .sort({
          cratedAt: 1
        })
        .select('name')
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }

  public findBy = async ({ search, type }) => {
    
    // TODO: Fix Track finder
    console.log("🚀 ~ TracksService ~ findBy= ~ type:", type)
    let track: Track;
    const searchTypeResponse = this.searchType(search)
    try {
      switch (searchTypeResponse) {
        case 'id':
          track = await this.trackModel.findById(search)
          break;
        case 'number':
          track = await this.trackModel.findOne({ no: search })
          break;
        case 'name':
          track = await this.trackModel.findOne({ name: search.toLocaleLowerCase() })
          break;
        default:
          track = null;
          break;
      }
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
    if(!track) throw new NotFoundException(`Track with ${ searchTypeResponse } "${ search }" not found`)
    return track;
  }
}
