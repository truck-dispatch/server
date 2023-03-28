import { Router } from 'express'
import multer from 'multer'
import verificationController from '../controllers/verification.controller'
import jwtMiddlewares from '../middlewares/jwt.middlewares'
import verificationMiddlewares from '../middlewares/verification.middlewares'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
})
const multerInstance = multer({
  storage,
})
const router = Router()

router.post(
  '/',
  multerInstance.fields([
    { name: 'idDoc', maxCount: 1 },
    { name: 'guarantor.idDoc', maxCount: 1 },
    { name: 'homeUtilityBill', maxCount: 1 },
  ]),
  jwtMiddlewares.jwtIsValid,
  verificationMiddlewares.checkVerificationSubmitDetails,
  verificationController.submitVerification
)

export default router
