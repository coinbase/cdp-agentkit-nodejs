import { Coinbase, Wallet, WalletCreateOptions, WalletAddress } from "@coinbase/coinbase-sdk";
import { HDKey } from "@scure/bip32";
import { ethers } from "ethers";

import { WalletData, WalletAddressData } from "./mocks";

export interface GenerateWalletDataOptions extends WalletCreateOptions {
  seed?: string;
}

export const DefaultGenerateWalletDataOptions = {
  networkId: Coinbase.networks.BaseSepolia,
  seed: "",
};

export const generateWalletData = (
  options: GenerateWalletDataOptions = DefaultGenerateWalletDataOptions,
) => {
  if (!options.networkId) {
    throw new Error("wallet network is required");
  }

  if (!options.seed) {
    options.seed = generateSeed();
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

//
// wallet address
//

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

//
// helpers
//

export const convertStringToHex = (key: Uint8Array): string => {
  return Buffer.from(key).toString("hex");
};

export const generateSeed = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};
