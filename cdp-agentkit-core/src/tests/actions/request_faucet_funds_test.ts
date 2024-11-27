import { Coinbase, SmartContract, Wallet } from "@coinbase/coinbase-sdk";

import {
  requestFaucetFunds,
  RequestFaucetFundsInput,
} from "../../actions/cdp/actions/request_faucet_funds";

import { newSmartContractFactory } from "../factories/smart_contract";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_ASSET_ID = Coinbase.assets.Eth;

const MOCK_OPTIONS = {
  assetId: MOCK_ASSET_ID,
};

describe("Request Faucet Funds Input", () => {
  it("should successfully parse valid input", () => {
    const result = RequestFaucetFundsInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("should successfully parsing empty input", () => {
    const emptyInput = {};
    const result = RequestFaucetFundsInput.safeParse(emptyInput);

    expect(result.success).toBe(true);
  });
});

describe("Request Faucet Funds Action", () => {
  let contract: SmartContract;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
  });

  beforeEach(() => {});

  it("should successfully request faucet funds", async () => {});

  it("should fail with an error", async () => {});
});
