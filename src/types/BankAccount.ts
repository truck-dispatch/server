export default interface BankAccount {
  type: 'nuban';
  name: string;
  account_number: string;
  bank_code: string;
  currency: 'NGN';
  reference?: string;
  userId: string;
  id: string;
  bank_name: string;
  paystackRecipientCode: string;
}
