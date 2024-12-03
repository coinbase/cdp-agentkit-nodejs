import { Coinbase, SmartContract, Wallet } from "@coinbase/coinbase-sdk";
import { wowBuyToken, WowBuyTokenInput } from "../actions/cdp/defi/wow/actions/buy_token";
import { getBuyQuote } from "../actions/cdp/defi/wow/utils";
import { getHasGraduated } from "../actions/cdp/defi/wow/uniswap/utils";

const MOCK_CONTRACT_ADDRESS = "0xabcdef123456789";
const MOCK_AMOUNT_ETH_IN_WEI = "100000000000000000";

describe("Wow Buy Token Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
      amountEthInWei: MOCK_AMOUNT_ETH_IN_WEI,
    };

    const result = WowBuyTokenInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = WowBuyTokenInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Wow Buy Token Action", () => {});
