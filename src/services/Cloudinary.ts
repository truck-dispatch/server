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
  isVideo?: boolean
  publicId?: string
}

class Cloudinary {
  async upload({ file, isVideo, publicId }: UploadParams): Promise<string> {
    let options: Record<string, unknown> = {}

    if (isVideo) options.resource_type = 'video'
    if (publicId) {
      options = {
        ...options,
        public_id: publicId,
        overwrite: true,
        invalidate: true,
      }
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, options)
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
