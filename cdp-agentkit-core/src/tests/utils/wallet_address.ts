import { Coinbase, WalletAddress } from "@coinbase/coinbase-sdk";
import { ethers } from "ethers";
import { HDKey } from "@scure/bip32";

import { WalletAddressData } from "../factories/wallet_address";

import { generateSeed } from "./seed";
import { convertStringToHex } from "./string";

export const getWalletAddressFromHDKey = (hdKey: HDKey): string => {
  return new ethers.Wallet(convertStringToHex(hdKey.privateKey!)).address;
};

export const generateWalletAddress = (address: WalletAddressData): WalletAddress => {
  return new WalletAddress(address);
};

export const generateWalletAddresses = (addresses: WalletAddressData[]): WalletAddress[] => {
  return addresses.map((value): WalletAddress => {
    return generateWalletAddress(value);
  });
};

export const generateWalletAddressData = (
  walletId: string,
  networkId: string = Coinbase.networks.BaseSepolia,
  index: number = 0,
): WalletAddressData => {
  return generateWalletAddressDataWithSeed(walletId, generateSeed());
};

export const generateWalletAddressDataWithSeed = (
  walletId: string,
  seed: string,
  networkId: string = Coinbase.networks.BaseSepolia,
  index: number = 0,
): WalletAddressData => {
  const hdkey = HDKey.fromMasterSeed(Buffer.from(seed, "hex"));
  const hdkeyDerived = hdkey.derive(`m/44'/60'/0'/0/0`);

  const addressId = getWalletAddressFromHDKey(hdkeyDerived);
  const privateKey = `0x${seed}`;

  return generateWalletAddressDataWithPrivateKey(walletId, privateKey, addressId, networkId, index);
};

export const generateWalletAddressDataWithPrivateKey = (
  walletId: string,
  privateKey: string,
  addressId: string = "",
  networkId: string = Coinbase.networks.BaseSepolia,
  index: number = 0,
): WalletAddressData => {
  if (!privateKey.startsWith("0x")) {
    throw new Error("invalid private key format");
  }

  if (privateKey.length <= 2) {
    throw new Error("invalid private key length");
  }

  jest.spyOn(ethers.Wallet, "createRandom").mockReturnValue({
    privateKey: privateKey,
  } as never);

  const address = ethers.Wallet.createRandom();
  addressId = addressId ? addressId : address.address;

  return {
    address_id: addressId,
    index: index,
    network_id: networkId,
    private_key: privateKey,
    public_key: address.publicKey,
    wallet_id: walletId,
  };
};
