export enum AccountType {
    asset = "asset",
    liability = "liability",
    equity = "equity",
    expense = "expense",
    revenue = "revenue"
}

export interface Account {
  accNo: number;
  enabled: boolean;
  name: string;
  type: AccountType;
  subType: string;
  balance: string;
  description?: string;
  createdAt?: Date;
}