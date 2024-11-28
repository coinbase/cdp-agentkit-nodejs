import { mockFn } from "../utils/mock";
import { WalletAddressData } from "./wallet_address";

export interface WalletData {
  id: string;
  address: WalletAddressData;
  networkId: string;
  privateKey: string;
}

export const newWalletFactory = (data: WalletData) => {
  const createWalletFn = mockFn(request => {
    const response = {
      id: data.id,
      network_id: data.networkId,
      default_address: data.address,
    };

    return { data: response };
  });

  const getWalletFn = mockFn(walletId => {
    const response = {
      id: data.id,
      network_id: data.networkId,
      default_address: data.address,
    };

    return { data: response };
  });

  return {
    createWallet: createWalletFn,
    deployNFT: jest.fn(),
    getWallet: getWalletFn,
    getWalletBalance: jest.fn(),
    listWallets: jest.fn(),
    listWalletBalances: jest.fn(),
  };
};
