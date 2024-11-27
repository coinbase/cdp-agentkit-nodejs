import { FaucetTransaction, Wallet } from "@coinbase/coinbase-sdk";
import { ethers } from "ethers";
import { TransactionStatusEnum } from "../factories/smart_contract";

export interface FaucetTransactionOptions {
  assetId?: string;
  transactionHash: string;
}

export const generateFaucetTransaction = (wallet: Wallet, options: FaucetTransactionOptions) => {
  return new FaucetTransaction(generateFaucetTransactionData(wallet, options));
};

export const generateFaucetTransactionData = (
  wallet: Wallet,
  options: FaucetTransactionOptions,
) => {
  return {
    transaction_hash: options.transactionHash,
    transaction_link: "https://sepolia.basescan.org/tx/" + options.transactionHash,
    transaction: {
      network_id: wallet.getNetworkId(),
      from_address_id: ethers.Wallet.createRandom().address,
      unsigned_payload: "",
      transaction_hash: options.transactionHash,
      transaction_link: "https://sepolia.basescan.org/tx/" + options.transactionHash,
      status: TransactionStatusEnum.Complete,
    },
  };
};

export const generateFaucetTransactionFromData = (data): FaucetTransaction => {
  return new FaucetTransaction(data);
};
