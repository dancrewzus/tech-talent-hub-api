import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { HandleErrors } from '../../common/utils/handleErrors.util'
import { DayJSAdapter } from 'src/common/adapters/dayjs.adapter'
import { CloudAdapter } from 'src/common/adapters/cloud.adapter'
import { CreateImageDto } from './dto/create-image.dto'
import { User } from '../users/entities/user.entity'
import { Image } from './entities/image.entity'

@Injectable()
export class ImagesService {

  constructor(
    @InjectModel(Image.name, 'default') private readonly imageModel: Model<Image>,
    private readonly handleErrors: HandleErrors,
    private readonly cloudAdapter: CloudAdapter,
    private readonly dayjs: DayJSAdapter,
  ) { }

  private formatReturnData = (image: Image) => { id: image.id || '' }

  /**
   * Creates a new image record in the database after uploading the image to a cloud storage service. This function
   * takes an image in base64 format and a type from the CreateImageDto, uploads the image to the cloud via the cloudAdapter,
   * and then creates a new record in the imageModel with the response from the cloud storage and metadata including the
   * creator's ID and timestamps. The created image data is then formatted and returned.
   *
   * @public
   * @async
   * @function create
   * @param {CreateImageDto} createImageDto - An object containing the base64 string of the image and the type of image being uploaded.
   * @param {User} userRequest - The user object of the requester, used to assign ownership of the created image.
   * @returns {Promise<object>} A promise that resolves to the formatted data of the newly created image. If an error occurs,
   *                            the promise rejects with an error and the error is handled appropriately.
   * @throws Captures and handles exceptions related to image upload or database operations.
   */
  public create = async (createImageDto: CreateImageDto, userRequest: User) => {
    try {
      const { base64, type } = createImageDto
      const cloudResponse = await this.cloudAdapter.uploadImage(base64, type)
      const image = await this.imageModel.create({
        createdBy: userRequest.id,
        createdAt: this.dayjs.getCurrentDateTime(),
        updatedAt: this.dayjs.getCurrentDateTime(),
        ...cloudResponse,
      });
      return this.formatReturnData(image)
    } catch (error) {
      this.handleErrors.handleExceptions(error)
    }
  }
}
