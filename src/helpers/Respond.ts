import { Response } from 'express'

class Respond {
  /**
   * Error Response
   * @param {Object} res response object
   * @param {String} msg message string for error response
   * @param {Number} status Status code
   */
  static error(
    res: Response,
    msg = 'an error occurred',
    status = 422,
    data?: any
  ): Response {
    return res.status(status).json({
      error: true,
      message: msg,
      data,
    })
  }

  /**
   * Success Response
   * @param {Object} res response object
   * @param {String} msg message string for success response
   * @param {Object} data response data
   */
  static success(res: Response, message = 'successs', data?: any): Response {
    return res.status(200).json({
      error: false,
      message,
      data,
    })
  }
}

export default Respond
