import { NextFunction, Request, Response } from 'express';
import { recordGetHelpData } from "@data/getHelp/GetHelpRepository";
import Respond from '@helpers/Respond';


class GetHelpController {
  async sendGetHelpData (req: Request, res: Response, next: NextFunction) {
    try {
      const { reportedTripId, reporterId, reportedId, issueMessage} = req.body

      // if( !reportedTripId || !reporterId || !reportedId || !issueMessage ) return Respond.error(res, 'reportedTripId, reporterId, reportedId, issueMessage fields are required')

      // const helpData = await recordGetHelpData({reportedTripId, reporterId, reportedId, issueMessage});

      return Respond.success(res, 'Your complaint has been recorded you will hear from us shortly', {})

    } catch (err) {
      next(err)
    }
  }
}
export default new GetHelpController();