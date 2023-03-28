import { Router } from 'express'
import multer from 'multer'
import VerificationController from '../controllers/VerificationController'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import VerificationMiddlewares from '../middlewares/VerificationMiddlewares'

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
  JWTMiddlewares.jwtIsValid,
  VerificationMiddlewares.checkVerificationSubmitDetails,
  VerificationController.submitVerification
)

export default router
