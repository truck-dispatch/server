import { Response } from 'express';

class Respond {
  /**
   * Error Response
   * @param {Object} res response object
   * @param {String} msg message string for error response
   * @param {Number} status Status code
   */
  static error(res: Response, msg = 'an error occurred', status = 422): Response {
    return res.status(status).json({
      error: true,
      msg,
    });
  }

  /**
   * Success Response
   * @param {Object} res response object
   * @param {String} msg message string for success response
   * @param {Object} data response data
   */
  static success(res: Response, msg = 'successs', data?: any): Response {
    return res.status(200).json({
      error: false,
      msg,
      data,
    });
  }
}

export default Respond