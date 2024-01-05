import { Types } from "mongoose";

export default interface GetHelpData {
  reportedTripId:string | Types.ObjectId;
  reporterId?: string | Types.ObjectId;
  reportedId?: string | Types.ObjectId;
  issueMessage: string;
}