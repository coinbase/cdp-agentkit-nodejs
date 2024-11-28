import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

import { RegisterBasenameInput } from "../../actions/cdp/actions/register_basename";

import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { generateWalletData } from "../utils/wallet";

const MOCK_AMMOUNT = 0.123;
const MOCK_BASENAME = "test-basename";

const MOCK_OPTIONS = {
  amount: MOCK_AMMOUNT,
  basename: MOCK_BASENAME,
};

describe("Register Basename Input", () => {
  it("should successfully parse valid input", () => {
    const result = RegisterBasenameInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = RegisterBasenameInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Register Basename Action", () => {
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

  it("should successfully register basename", async () => {});

  it("should fail with an error", async () => {});
});
