import { NextFunction, Request, Response } from 'express'

class UserMiddlewares{
    checkDetailsForCreateAccount(
        req: Request,
        res: Response,
        next: NextFunction
    ){
       try{
         const {
          account_name,
          account_number,
          bank_id
         } = req.body
         if(!account_name || !account_number || !bank_id){

         }
       }catch(err){

       }
    }

}