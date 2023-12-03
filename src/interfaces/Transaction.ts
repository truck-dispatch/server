import { Types } from 'mongoose'

export default interface Transaction {
    userId: string | Types.ObjectId
    processorReference: string;
    transaction: string;
    amount: number;
    totalAmount: number;
    type: 'credit' | 'debit'
}