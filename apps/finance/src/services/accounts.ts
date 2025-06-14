import { Account } from "@/app/accounts/accounts.type";

export const FetchAllAccounts = async () => {
  const response = await fetch("http://localhost:5005/api/v1/accounts");
  const json = (await response.json()) as Account[];
  if (!response.ok) {
    throw new Error("Failed to fetch accounts!");
  }
  return json;
};
