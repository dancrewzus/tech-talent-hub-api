
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
   * Initializes the Cloudinary instance with configuration settings pulled from environment-specific settings.
   * This method is typically called at the start of the application to set up the Cloudinary library for subsequent
   * operations involving image uploads, transformations, and other media-related tasks. The configuration includes
   * the cloud name, API key, and API secret which are essential for authenticating API requests to Cloudinary.
   *
   * @private
   * @function initInstance
   * @returns {void} This method does not return any value. It configures the Cloudinary service for use throughout the application.
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
      this.initInstance();
      const folder = `tech-talent-hub-${type}`; // clients, properties, users
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
      this.errors.handleError(`Failed to upload image: ${error ? error.error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deletes all resources from Cloudinary.
   */
  public deleteAllResources = async (): Promise<void> => {
    try {
      this.initInstance()
      await cloudinary.api.delete_all_resources();
    } catch (error) {
      this.errors.handleError(`Failed to delete all images: ${error ? error.error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Deletes a specific resource from Cloudinary by public ID.
   * @param publicId The public ID of the resource to delete.
   */
  public deleteResource = async (publicId: string): Promise<void> => {
    try {
      this.initInstance()
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.errors.handleError(`Failed to delete an images: ${error ? error.error.message : 'Unknown error'}`);
    }
  }

}