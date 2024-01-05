import { Router } from "express";
import GetHelpController from "@controllers/GetHelpController";

const router = Router();

router.post(
  '/',
  GetHelpController.sendGetHelpData
)
 
export default router   