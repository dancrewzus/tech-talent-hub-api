
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
   * Uploads a base64-encoded image to Cloudinary under a specific folder determined by the type parameter.
   * This method first initializes the Cloudinary instance with necessary configurations. It then uploads the
   * image to a folder named in a format that includes a prefix followed by the type, e.g., 'tech-talent-hub-clients'.
   * On successful upload, it returns various details about the uploaded image such as the URL, public ID,
   * folder name, format, size in bytes, and dimensions.
   *
   * @public
   * @async
   * @function uploadImage
   * @param {string} base64 - The base64-encoded string of the image to be uploaded.
   * @param {string} type - The category or type of the image, used to determine the folder for upload.
   * @returns {Promise<object>} A promise that resolves to an object containing details of the uploaded image.
   *                            If an error occurs, the promise resolves to null and logs an error message.
   * @throws Logs an error message if the upload fails for any reason.
   */
  public uploadImage = async (base64: string, type: string): Promise<any> => {
    try {
      this.initInstance();
      const folder = `tech-talent-hub-${type}`;
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
   * Deletes all resources stored in the cloud service. This method initializes the cloud service instance 
   * and then instructs the cloud service to delete all stored resources. It's a potentially dangerous operation 
   * and should be used with caution, typically under controlled conditions such as cleaning up in a development 
   * environment or removing unused assets.
   *
   * @public
   * @async
   * @function deleteAllResources
   * @returns {Promise<void>} A promise that resolves when all resources have been successfully deleted, 
   *                          or rejects if an error occurs during the deletion process.
   * @throws Logs an error if the deletion process fails, providing details of the error if available, or 
   *              a generic message if the error details are not accessible.
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
   * Deletes a specific resource from the cloud service using the resource's public ID. This function initializes the cloud 
   * service instance before sending a deletion request for the resource identified by the provided publicId. It is used
   * to manage storage by removing unnecessary or outdated resources on demand.
   *
   * @public
   * @async
   * @function deleteResource
   * @param {string} publicId - The public identifier of the resource to be deleted. This ID is typically assigned by the
   *                             cloud service when the resource is initially uploaded.
   * @returns {Promise<void>} A promise that resolves when the resource has been successfully deleted, or rejects if an
   *                          error occurs during the deletion process.
   * @throws Logs an error if the deletion fails, with a detailed message if available, or a generic error message if not.
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