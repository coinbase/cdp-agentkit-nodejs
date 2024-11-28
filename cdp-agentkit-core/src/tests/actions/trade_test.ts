import { Coinbase, SmartContract, Trade, Wallet } from "@coinbase/coinbase-sdk";

import { trade as createTrade, TradeInput } from "../../actions/cdp/actions/trade";

import { newTradeFactory } from "../factories/trade";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { mockReturnRejectedValue, mockReturnValue } from "../utils/mock";
import { generateTradeData, generateTradeFromData } from "../utils/trade";
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
  let trade: Trade;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();

    const tradeDataOptions = {
      ...MOCK_OPTIONS,
      addressId: "0x123",
      fromAmount: 0.123,
      toAmount: 0.321,
    };

    const tradeData = generateTradeData(wallet, tradeDataOptions);

    Coinbase.apiClients.trade = newTradeFactory();
    Coinbase.apiClients.trade.getTrade = mockReturnValue(tradeData);

    trade = generateTradeFromData(tradeData);
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).createTrade = jest.fn().mockResolvedValue(trade);
  });

  it("should successfully execute the trade", async () => {
    const response = await createTrade(wallet, MOCK_AMOUNT, MOCK_ASSET_ID_FROM, MOCK_ASSET_ID_TO);
    const expected = `Traded ${MOCK_AMOUNT} of ${MOCK_ASSET_ID_FROM} for ${trade.getToAmount()} of ${MOCK_ASSET_ID_TO}.\nTransaction hash for the trade: ${trade.getTransaction().getTransactionHash()}\nTransaction link for the trade: ${trade.getTransaction().getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).createTrade).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).createTrade).toHaveBeenCalledWith(MOCK_OPTIONS);
    expect(response).toEqual(expected);
  });

  it("should fail with an error", async () => {
    const error = new Error("Failed to execute trade");

    Coinbase.apiClients.trade!.getTrade = mockReturnRejectedValue(error);

    const response = await createTrade(wallet, MOCK_AMOUNT, MOCK_ASSET_ID_FROM, MOCK_ASSET_ID_TO);
    const expected = `Error trading assets: ${error.message}`;
  });
});
