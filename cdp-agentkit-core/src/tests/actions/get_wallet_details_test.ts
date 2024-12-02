import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

import {
  getWalletDetails,
  GetWalletDetailsInput,
} from "../../actions/cdp/get_wallet_details";

import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { generateWalletData } from "../utils/wallet";

const MOCK_OPTIONS = {};

describe("Wallet Details Input", () => {
  it("sould successfully parse empty input", () => {
    const result = GetWalletDetailsInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("sould successfully parse empty input", () => {
    const emptyInput = {};

    const result = GetWalletDetailsInput.safeParse(emptyInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(emptyInput);
  });
});

describe("Wallet Details Action", () => {
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();

    Coinbase.apiClients.address = newWalletAddressFactory([walletData.address]);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
  });

  it("should successfully respond", async () => {
    const response = await getWalletDetails(wallet, MOCK_OPTIONS);
    const expected = `Wallet: ${wallet.getId()} on network: ${wallet.getNetworkId()} with default address: ${(await wallet.getDefaultAddress()).getId()}`;

    expect(response).toEqual(expected);
  });
});
