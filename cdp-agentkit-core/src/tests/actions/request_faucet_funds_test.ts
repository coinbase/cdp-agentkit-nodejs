import { Coinbase, FaucetTransaction, SmartContract, Wallet } from "@coinbase/coinbase-sdk";

import {
  requestFaucetFunds,
  RequestFaucetFundsInput,
} from "../../actions/cdp/request_faucet_funds";

import { newExternalAddressFactory } from "../factories/external_address";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import {
  generateFaucetTransactionData,
  generateFaucetTransactionFromData,
} from "../utils/faucet_transaction";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_ASSET_ID = Coinbase.assets.Usdc;

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
  let faucetTransaction: FaucetTransaction;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();

    const faucetTransactionDataOptions = {
      ...MOCK_OPTIONS,
      transactionHash: "0x123",
    };

    const faucetTransactionData = generateFaucetTransactionData(wallet, faucetTransactionDataOptions);

    Coinbase.apiClients.externalAddress = newExternalAddressFactory();
    Coinbase.apiClients.externalAddress.getFaucetTransaction =
      mockReturnValue(faucetTransactionData);

    faucetTransaction = generateFaucetTransactionFromData(faucetTransactionData);
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).faucet = jest.fn().mockResolvedValue(faucetTransaction);
  });

  it("should successfully request faucet funds", async () => {
    const response = await requestFaucetFunds(wallet, {});
    const expected = `Received ETH from the faucet. Transaction: ${faucetTransaction.getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).faucet).toHaveBeenCalledTimes(1);
    expect(response).toEqual(expected);
  });

  it("should successfully request faucet funds for the asset id", async () => {
    const response = await requestFaucetFunds(wallet, MOCK_OPTIONS);
    const expected = `Received ${MOCK_ASSET_ID} from the faucet. Transaction: ${faucetTransaction.getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).faucet).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).faucet).toHaveBeenCalledWith(MOCK_ASSET_ID);
    expect(response).toEqual(expected);
  });

  it("should fail with an error", async () => {
    const error = new Error("Failed to request funds");

    Coinbase.apiClients.externalAddress!.getFaucetTransaction = mockReturnRejectedValue(error);

    const response = await requestFaucetFunds(wallet, {});
    const expected = `Error requesting faucet funds: ${error.message}`;

    expect((await wallet.getDefaultAddress()).faucet).toHaveBeenCalledTimes(1);
    expect(response).toEqual(expected);
  });
});
