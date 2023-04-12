import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from '../common/privateKeys'
import { v2 as cloudinaryV2 } from 'cloudinary'
import fs from 'fs'
import { Helpers } from '../helpers'

const cloudinary = cloudinaryV2
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  upload_preset: CLOUDINARY_UPLOAD_PRESET,
  secure: true,
})

export interface UploadParams {
  file: { path: string } // Change the type of file to 'any' or 'Buffer'
  isVideo?: boolean
}

class Cloudinary {
  /**
   *
   * @param uploadParams: this is of typee Upload params. it takes in details about the new upload about to happen.
   * @param cloudinaryUrlForPreviousAsset: This is the url of the previous asset that was uploaded. The goal is to extract the upload preset from the url
   * Which would give us the ability to update the image instead of creating a new one. This helps us save cost.
   * @returns
   */
  async upload(
    { file, isVideo }: UploadParams,
    cloudinaryUrlForPreviousAsset?: string
  ): Promise<string> {
    let options: Record<string, unknown> = {
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
    }
    if (isVideo) options.resource_type = 'video'
    if (cloudinaryUrlForPreviousAsset) {
      const publicId = Helpers.extractPublicIdFromURL(
        cloudinaryUrlForPreviousAsset!
      )
      if (publicId) {
        options = {
          ...options,
          public_id: publicId,
          overwrite: true,
          invalidate: true,
        }
      }
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, options)
      return result.secure_url!
    } catch (err) {
      // TODO: check format of error
      console.log(err)
      // @ts-ignore
      throw new Error(err.message)
    } finally {
      // Delete in both success and error cases
      fs.unlink(file.path, (err) => {
        if (err) throw new Error(err.message)
      })
    }
  }
}

export default new Cloudinary()
