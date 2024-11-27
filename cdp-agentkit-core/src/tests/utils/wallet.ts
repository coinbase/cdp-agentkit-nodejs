import { Coinbase } from "@coinbase/coinbase-sdk";
import { ethers } from "ethers";

import { WalletData } from "../factories/wallet";
import { generateWalletAddressDataWithSeed } from "./wallet_address";
import { generateSeed } from "./seed";

export const generateWalletData = (): WalletData => {
  return generateWalletDataWithSeed(generateSeed());
};

export const generateWalletDataWithSeed = (
  seed: string,
  network: string = Coinbase.networks.BaseSepolia,
): WalletData => {
  const walletId = crypto.randomUUID();
  const walletAddress = generateWalletAddressDataWithSeed(walletId, seed);

  return {
    id: walletId,
    address: walletAddress,
    networkId: network,
    privateKey: "",
  };
};
