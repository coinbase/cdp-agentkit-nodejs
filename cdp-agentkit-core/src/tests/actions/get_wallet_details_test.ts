import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

import {
  getWalletDetails,
  GetWalletDetailsInput,
} from "../../actions/cdp/get_wallet_details";

import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { generateWalletData } from "../utils/wallet";

describe("Wallet Details Input", () => {
  it("sould successfully parse empty input", () => {
    const validInput = {};

    const result = GetWalletDetailsInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("sould successfully parse input with instructions", () => {
    const validInput = {
      instructions: "hello, world!",
    };

    const result = GetWalletDetailsInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
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
    const response = await getWalletDetails(wallet);
    const expected = `Wallet: ${wallet.getId()} on network: ${wallet.getNetworkId()} with default address: ${(await wallet.getDefaultAddress()).getId()}`;

    expect(response).toEqual(expected);
  });
});
