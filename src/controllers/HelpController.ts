import { NextFunction, Request, Response } from 'express';
import { recordGetHelpData } from "@data/getHelp/GetHelpRepository";
import Respond from '@helpers/Respond';


class HelpController {
  async sendGetHelpData (req: Request, res: Response, next: NextFunction) {
    try {
      const { reportedTripId, reporterId, reportedId, complaint} = req.body

      if( !reportedTripId || !reporterId || !reportedId || !complaint ) return Respond.error(res, 'reportedTripId, reporterId, reportedId, issueMessage fields are required')

      const helpData = await recordGetHelpData({reportedTripId, reporterId, reportedId, complaint});

      return Respond.success(res, 'Your complaint has been recorded you will hear from us shortly', {helpData})

    } catch (err) {
      next(err)
    }
  }
}
export default new HelpController();