import { CreateTransferOptions, Transfer, Wallet } from "@coinbase/coinbase-sdk";

import { ethers } from "ethers";

import { TransactionStatusEnum } from "../factories/smart_contract";

export interface TransferDataOptions extends CreateTransferOptions {
  transactionHash?: string;
}

const PAYLOAD_UNSIGNED =
  "7b2274797065223a22307832222c22636861696e4964223a2230783134613334222c226e6f6e6365223a22307830222c22746f223a22307834643965346633663464316138623566346637623166356235633762386436623262336231623062222c22676173223a22307835323038222c226761735072696365223a6e756c6c2c226d61785072696f72697479466565506572476173223a2230783539363832663030222c226d6178466565506572476173223a2230783539363832663030222c2276616c7565223a2230783536626337356532643633313030303030222c22696e707574223a223078222c226163636573734c697374223a5b5d2c2276223a22307830222c2272223a22307830222c2273223a22307830222c2279506172697479223a22307830222c2268617368223a22307836646333343065346436633236336533633965613961356564386465613463323839666138613639663031653635393462333732386230386138323335333433227d";

export const generateTransfer = (wallet: Wallet, options: TransferDataOptions): Transfer => {
  return Transfer.fromModel(generateTransferData(wallet, options));
};

export const generateTransferData = (wallet: Wallet, options: TransferDataOptions) => {
  return {
    transfer_id: crypto.randomUUID(),
    network_id: wallet.getNetworkId(),
    wallet_id: wallet.getId()!,
    asset: {
      asset_id: options.assetId,
      network_id: wallet.getNetworkId(),
      decimals: 18,
      contract_address: "0x",
    },
    transaction: {
      network_id: wallet.getNetworkId(),
      from_address_id: "0xdeadbeef",
      unsigned_payload: PAYLOAD_UNSIGNED,
      transaction_hash: options.transactionHash,
      transaction_link: "https://sepolia.basescan.org/tx/" + options.transactionHash,
      status: TransactionStatusEnum.Complete,
    },
    address_id: ethers.Wallet.createRandom().address,
    destination: "0x4D9E4F3f4D1A8B5F4f7b1F5b5C7b8d6b2B3b1b0b",
    asset_id: options.assetId,
    amount: options.amount.toString(),
    gasless: false,
  };
};

export const generateTransferFromData = (data): Transfer => {
  return Transfer.fromModel(data);
};
