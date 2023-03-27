import {
  CLOUDINARY_IMAGE_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_VIDEO_UPLOAD_URL,
} from '../common/privateKeys'
import ApiService from './ApiService'

interface UploadParams {
  file: File
}
export default class Cloudinary {
  Api: ApiService
  constructor(isImage: boolean) {
    this.Api = new ApiService(
      isImage ? CLOUDINARY_IMAGE_UPLOAD_URL : CLOUDINARY_VIDEO_UPLOAD_URL
    )
  }
  upload({ file }: UploadParams) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    return this.Api.post('/', formData).then((response) => {
      const fileUrl = response.data.secure_url
      return Promise.resolve(fileUrl)
    }).catch(err => {
        console.log(err.response.data)
        return Promise.reject(err.response.data.error.message)
    })
  }
}
