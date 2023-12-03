import Transaction from "@interfaces/Transaction";
import { TransactionModel } from "./TransactionModel";

export async function createTransaction(data: Transaction) {
    const transaction = new TransactionModel(data)
    return transaction.save()
}