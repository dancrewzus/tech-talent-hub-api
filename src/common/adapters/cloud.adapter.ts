
import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import envConfig from '../../config/env.config'

@Injectable()
export class CloudAdapter {
  
  private initInstance = () => {
    cloudinary.config({ 
      cloud_name: envConfig().cloudinaryCloudName, 
      api_secret: envConfig().cloudinaryApiSecret,
      api_key: envConfig().cloudinaryApiKey, 
    });
  }

  public uploadImage = async (base64: string, type: string): Promise<any> => {
    try {
      this.initInstance();

      let folder = ''

      switch (type) {
        
        case 'client':
          folder = 'Clients'
          break;
        
        case 'payment':
          folder = 'Payments'
          break;

        case 'direction':
          folder = 'Directions'
          break;
      
        default: break;
      }
      const response = await cloudinary.uploader.upload(
        base64,
        { folder }
      )

      return {
        imageUrl: response.secure_url,
        publicId: response.public_id,
        folder: response.folder,
        format: response.format,
        bytes: response.bytes,
        width: response.width,
        height: response.height,
      }
    } catch (error) {
      throw new Error('Cannot upload resource.');
    }
  }

  public deleteAllResources = async () => {
    try {
      this.initInstance()

      await cloudinary.api.delete_all_resources()

      return

    } catch (error) {
      console.log('Cannot delete all resources.');
    }
  }
  
  public deleteResource = async (publicId: string) => {
    try {
      this.initInstance()

      await cloudinary.uploader.destroy(publicId)

      return

    } catch (error) {
      console.log("Cannot delete resource. " + error.message);
    }
  }

}