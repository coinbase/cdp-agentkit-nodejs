import { Coinbase, WalletCreateOptions } from "@coinbase/coinbase-sdk";
import { ethers } from "ethers";

import { WalletData } from "../factories/wallet";
import { generateWalletAddressDataWithSeed } from "./wallet_address";
import { generateSeed } from "./seed";

export interface GenerateWalletDataOptions extends WalletCreateOptions {
  seed?:string
}

export const DefaultGenerateWalletDataOptions = {
  networkId: Coinbase.networks.BaseSepolia,
  seed: "",
}

// export const generateWalletData = (): WalletData => {
//   return generateWalletDataWithOptions();
// };

export const generateWalletData = (options: GenerateWalletDataOptions = DefaultGenerateWalletDataOptions) => {
  if (!options.networkId) {
    throw new Error("wallet network is required");
  }

  if (!options.seed) {
    options.seed = generateSeed()
  }

  const walletId = crypto.randomUUID();
  const walletAddress = generateWalletAddressDataWithSeed(walletId, options.seed);

  return {
    id: walletId,
    address: walletAddress,
    networkId: options.networkId,
    privateKey: options.seed,
  };
};
