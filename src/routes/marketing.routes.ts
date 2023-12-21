import {Router} from 'express';
import MarketingController from '@controllers/MarketingController';

const router = Router();

router.post(
  '/send-message',
  MarketingController.sendMessage
)
 
export default router  