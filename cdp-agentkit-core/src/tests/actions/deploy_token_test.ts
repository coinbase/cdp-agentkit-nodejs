import { Coinbase, SmartContract, SmartContractType, Wallet } from "@coinbase/coinbase-sdk";

import { deployToken, DeployTokenInput } from "../../actions/cdp/actions/deploy_token";

import { newSmartContractFactory } from "../factories/smart_contract";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import {
  generateERC20SmartContractData,
  generateERC20SmartContractFromData,
} from "../utils/smart_contract";
import { generateWalletData } from "../utils/wallet";

const MOCK_TOKEN_NAME = "Test Token";
const MOCK_TOKEN_SYMBOL = "TEST";
const MOCK_TOKEN_SUPPLY = 100;

const MOCK_OPTIONS = {
  name: MOCK_TOKEN_NAME,
  symbol: MOCK_TOKEN_SYMBOL,
  totalSupply: MOCK_TOKEN_SUPPLY,
};

describe("Deploy Token Input", () => {
  it("should successfully parse valid input", () => {
    const result = DeployTokenInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("sould fail parsing empty input", () => {
    const emptyInput = {};
    const result = DeployTokenInput.safeParse(emptyInput);

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

    const contractData = generateERC20SmartContractData(wallet, MOCK_OPTIONS);

    contract = generateERC20SmartContractFromData(contractData);

    Coinbase.apiClients.smartContract = newSmartContractFactory();
    Coinbase.apiClients.smartContract.getSmartContract = mockReturnValue(contractData);
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).deployToken = jest.fn().mockResolvedValue(contract);
  });

  it("should successfully respond", async () => {
    const response = await deployToken(
      wallet,
      MOCK_TOKEN_NAME,
      MOCK_TOKEN_SYMBOL,
      MOCK_TOKEN_SUPPLY,
    );

    const expected = `Deployed ERC20 token contract ${MOCK_TOKEN_NAME} (${MOCK_TOKEN_SYMBOL}) with total supply of ${MOCK_TOKEN_SUPPLY} tokens at address ${contract.getContractAddress()}. Transaction link: ${contract.getTransaction().getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).deployToken).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).deployToken).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });

  it("should fail with an error", async () => {
    const error = new Error("Invalid model type");

    Coinbase.apiClients.smartContract!.getSmartContract = mockReturnRejectedValue(error);

    const response = await deployToken(
      wallet,
      MOCK_TOKEN_NAME,
      MOCK_TOKEN_SYMBOL,
      MOCK_TOKEN_SUPPLY,
    );

    const expected = `Error deploying token: ${error.message}`;

    expect((await wallet.getDefaultAddress()).deployToken).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).deployToken).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });
});
