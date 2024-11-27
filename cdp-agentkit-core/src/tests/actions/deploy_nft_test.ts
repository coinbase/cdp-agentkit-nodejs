import { Coinbase, SmartContract, SmartContractType, Wallet } from "@coinbase/coinbase-sdk";

import { deployNft, DeployNftInput } from "../../actions/cdp/actions/deploy_nft";

import { newSmartContractFactory } from "../factories/smart_contract";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import {
  generateERC721SmartContractData,
  generateERC721SmartContractFromData,
} from "../utils/smart_contract";
import { generateWalletData } from "../utils/wallet";

const MOCK_NFT_NAME = "Test Token";
const MOCK_NFT_SYMBOL = "TEST";
const MOCK_NFT_URI = "https://www.test.xyz/metadata/";

export const MOCK_OPTIONS = {
  name: MOCK_NFT_NAME,
  symbol: MOCK_NFT_SYMBOL,
  baseURI: MOCK_NFT_URI,
};

describe("Deploy NFT Input", () => {
  it("should successfully parse valid input", () => {
    const result = DeployNftInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("sould fail parsing empty input", () => {
    const emptyInput = {};
    const result = DeployNftInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Deploy NFT Action", () => {
  let contract: SmartContract;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();

    const contractData = generateERC721SmartContractData(wallet, MOCK_OPTIONS);
    contract = generateERC721SmartContractFromData(contractData);

    Coinbase.apiClients.smartContract = newSmartContractFactory();
    Coinbase.apiClients.smartContract.getSmartContract = mockReturnValue(contractData);
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).deployNFT = jest.fn().mockResolvedValue(contract);
  });

  it("should successfully respond", async () => {
    const response = await deployNft(
      wallet,
      MOCK_OPTIONS.name,
      MOCK_OPTIONS.symbol,
      MOCK_OPTIONS.baseURI,
    );

    const expected = `Deployed NFT Collection ${MOCK_NFT_NAME} to address ${contract.getContractAddress()} on network ${wallet.getNetworkId()}.\nTransaction hash for the deployment: ${contract.getTransaction().getTransactionHash()}\nTransaction link for the deployment: ${contract.getTransaction().getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).deployNFT).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).deployNFT).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });

  it("should fail with an error", async () => {
    const error = new Error("Invalid model type");

    Coinbase.apiClients.smartContract!.getSmartContract = mockReturnRejectedValue(error);

    const response = await deployNft(
      wallet,
      MOCK_OPTIONS.name,
      MOCK_OPTIONS.symbol,
      MOCK_OPTIONS.baseURI,
    );

    const expected = `Error deploying NFT: ${error.message}`;

    expect((await wallet.getDefaultAddress()).deployNFT).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).deployNFT).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });
});
