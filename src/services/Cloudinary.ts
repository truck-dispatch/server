import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from '../common/privateKeys'
import { v2 as cloudinaryV2 } from 'cloudinary'
import fs from 'fs'

const cloudinary = cloudinaryV2
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  upload_preset: CLOUDINARY_UPLOAD_PRESET,
  secure: true,
})

interface UploadParams {
  file: { path: string } // Change the type of file to 'any' or 'Buffer'
  isVideo: boolean
}

class Cloudinary {
  async upload({ file, isVideo }: UploadParams): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(
        file.path,
        isVideo ? { resource_type: 'video' } : {}
      )
      fs.unlink(file.path, (err) => {
        if (err) throw new Error(err.message)
      })
      return result.secure_url!
    } catch (err) {
      // TODO: check format of error
      // @ts-ignore
      throw new Error(err.message)
    }
  }
}

export default new Cloudinary()
