import { Coinbase, Transfer, Wallet } from "@coinbase/coinbase-sdk";

import { transfer as createTransfer, TransferInput } from "../../actions/cdp/transfer";

import { newTransferFactory } from "../factories/transfer";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { generateTransferData, generateTransferFromData } from "../utils/transfer";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_AMOUNT = 0.123456789012345678;
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
  let transfer: Transfer;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();

    const transferDataOptions = {
      ...MOCK_OPTIONS,
      transactionHash: "0x123",
    };

    const transferData = generateTransferData(wallet, transferDataOptions);

    Coinbase.apiClients.transfer = newTransferFactory();
    Coinbase.apiClients.transfer.getTransfer = mockReturnValue(transferData);

    transfer = generateTransferFromData(transferData);
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).createTransfer = jest.fn().mockResolvedValue(transfer);
  });

  it("should successfully transfer token", async () => {
    const response = await createTransfer(wallet, MOCK_OPTIONS);
    const expected = `Transferred ${MOCK_AMOUNT} of ${MOCK_ASSET_ID} to ${MOCK_DESTINATION}.\nTransaction hash for the transfer: ${transfer.getTransactionHash()}\nTransaction link for the transfer: ${transfer.getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).createTransfer).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).createTransfer).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });

  it("should fail with an error", async () => {
    const error = new Error("Failed to execute transfer");

    Coinbase.apiClients.transfer!.getTransfer = mockReturnRejectedValue(error);

    const response = await createTransfer(wallet, MOCK_OPTIONS);
    const expected = `Error transferring the asset: ${error.message}`;

    expect((await wallet.getDefaultAddress()).createTransfer).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).createTransfer).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });
});
