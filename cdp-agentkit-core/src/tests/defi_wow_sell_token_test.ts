import { Coinbase, ContractInvocation, Wallet } from "@coinbase/coinbase-sdk";

import { wowSellToken, WowSellTokenInput } from "../actions/cdp/defi/wow/actions/sell_token";

const CONTRACT_ADDRESS = "0x036cbd53842c5426634e7929541ec2318f3dcf7e";

describe("Wow Sell Token Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      contractAddress: CONTRACT_ADDRESS,
      amountTokensInWei: "1000000000000000000",
    };

    const result = WowSellTokenInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail with missing amountTokensInWei", () => {
    const invalidInput = {
      contractAddress: CONTRACT_ADDRESS,
    };
    const result = WowSellTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(false);
  });

  it("does not fail with invalid contract address", () => {
    const invalidInput = {
      contractAddress: CONTRACT_ADDRESS,
      amountTokensInWei: "1000000000000000000",
    };
    const result = WowSellTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(true);
  });

  it("does not fail with non-numeric amountTokensInWei", () => {
    const invalidInput = {
      contractAddress: CONTRACT_ADDRESS,
      amountTokensInWei: "not_a_number",
    };
    const result = WowSellTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(true);
  });
});
