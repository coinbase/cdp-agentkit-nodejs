import { TransactionData } from "./smart_contract";

export interface FaucetTransactionData {
  transaction_hash: string;
  transaction_link: string;
  transaction: TransactionData;
}

export const newExternalAddressFactory = () => {
  return {
    listExternalAddressBalances: jest.fn(),
    getExternalAddressBalance: jest.fn(),
    requestExternalFaucetFunds: jest.fn(),
    listAddressTransactions: jest.fn(),
    getFaucetTransaction: jest.fn(),
  };
};
