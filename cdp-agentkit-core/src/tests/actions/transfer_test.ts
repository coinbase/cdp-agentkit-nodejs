import { Coinbase, SmartContract, Wallet } from "@coinbase/coinbase-sdk";

import { transfer, TransferInput } from "../../actions/cdp/actions/transfer";

import { newSmartContractFactory } from "../factories/smart_contract";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_AMOUNT = 0.123;
const MOCK_ASSET_ID = Coinbase.assets.Eth;
const MOCK_DESTINATION = "0x321";
const MOCK_GASLESS = true;

const MOCK_OPTIONS = {
  amount: MOCK_AMOUNT,
  assetId: MOCK_ASSET_ID,
  destination: MOCK_DESTINATION,
  gasless: MOCK_GASLESS,
};

describe("Transfer Input", () => {
  it("should successfully parse valid input", () => {
    const result = TransferInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = TransferInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Transfer Action", () => {
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

  it("should successfully transfer token", async () => {});

  it("should fail with an error", async () => {});
});
