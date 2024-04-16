
import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import envConfig from '../../config/env.config'

import { HandleErrors } from '../utils/utils'

@Injectable()
export class CloudAdapter {
  
  constructor(
    private readonly errors: HandleErrors,
  ) {
    this.initInstance();
  }

  /**
   * Initializes the Cloudinary configuration.
   */
  private initInstance = (): void => {
    cloudinary.config({ 
      cloud_name: envConfig().cloudinaryCloudName, 
      api_secret: envConfig().cloudinaryApiSecret,
      api_key: envConfig().cloudinaryApiKey, 
    });
  }

  /**
   * Uploads an image to Cloudinary.
   * @param base64 The base64-encoded image string.
   * @param type The type of the image (e.g., 'clients', 'properties', 'users').
   * @returns The upload response including image URL and metadata.
   */
  public uploadImage = async (base64: string, type: string): Promise<any> => {
    try {
      const folder = `rentmies-${type}`; // clients, properties, users
      const response = await cloudinary.uploader.upload(base64, { folder });
      return {
        imageUrl: response.secure_url,
        publicId: response.public_id,
        folder: response.folder,
        format: response.format,
        bytes: response.bytes,
        width: response.width,
        height: response.height,
      };
    } catch (error) {
      this.errors.handleError(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes all resources from Cloudinary.
   */
  public deleteAllResources = async (): Promise<void> => {
    try {
      await cloudinary.api.delete_all_resources();
    } catch (error) {
      this.errors.handleError(`Failed to delete all images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Deletes a specific resource from Cloudinary by public ID.
   * @param publicId The public ID of the resource to delete.
   */
  public deleteResource = async (publicId: string): Promise<void> => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.errors.handleError(`Failed to delete an images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

}