import { Coinbase, SmartContract, Wallet } from "@coinbase/coinbase-sdk";

import { trade, TradeInput } from "../../actions/cdp/actions/trade";

import { newSmartContractFactory } from "../factories/smart_contract";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_AMOUNT = 0.123;
const MOCK_ASSET_ID_FROM = Coinbase.assets.Eth;
const MOCK_ASSET_ID_TO = Coinbase.assets.Usdc;

const MOCK_OPTIONS = {
  amount: MOCK_AMOUNT,
  fromAssetId: MOCK_ASSET_ID_FROM,
  toAssetId: MOCK_ASSET_ID_TO,
};

describe("Trade Input", () => {
  it("should successfully parse valid input", () => {
    const result = TradeInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = TradeInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Trade Action", () => {
  let contract: SmartContract;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.apiClients.smartContract = newSmartContractFactory();
  });

  beforeEach(() => {});

  it("should successfully execute trade", async () => {});

  it("should fail with an error", async () => {});
});
