import { Coinbase, Wallet, WalletAddress } from "@coinbase/coinbase-sdk";

import { getBalance, GetBalanceInput } from "../../actions/cdp/get_balance";

import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";
import { generateWalletAddresses } from "../utils/wallet_address";

const MOCK_ASSET_ID = crypto.randomUUID();

const MOCK_OPTIONS = {
  assetId: MOCK_ASSET_ID,
};

describe("Get Balance Input", () => {
  it("should successfully parse valid input", () => {
    const result = GetBalanceInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("sould fail parsing empty input", () => {
    const emptyInput = {};
    const result = GetBalanceInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Get Balance Action", () => {
  let wallet: Wallet;
  let walletAddresses: WalletAddress[];

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddressesData = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddressesData);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
    walletAddresses = generateWalletAddresses(walletAddressesData);
  });

  // TODO: test with multiple addresses
  // TODO: test with multiple assets
  it("should successfully respond", async () => {
    let expectedLines: string[] = [];

    wallet.listAddresses = jest.fn().mockResolvedValue(walletAddresses);
    walletAddresses.forEach(address => {
      address.getBalance = jest.fn().mockResolvedValue(1.0);
      expectedLines.push(`${address.getId()}: 1`);
    });

    const response = await getBalance(wallet, MOCK_OPTIONS);
    const expected = `Balances for wallet ${wallet.getId()}:\n${expectedLines.join("\n")}`;

    expect(wallet.listAddresses).toHaveBeenCalledTimes(1);
    expect(response).toEqual(expected);
  });

  it("should fail with an API Error error", async () => {
    const error = new Error("API Error");

    wallet.listAddresses = mockReturnRejectedValue(error);

    const response = await getBalance(wallet, MOCK_OPTIONS);
    const expected = `Error getting balance for all addresses in the wallet: ${error.message}`;

    expect(wallet.listAddresses).toHaveBeenCalledTimes(1);
    expect(response).toEqual(expected);
  });
});
