import { WowCreateTokenInput } from "../actions/cdp/defi/wow/actions/create_token";

describe("Wow Create Token Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      name: "WowCoin",
      symbol: "WOW",
      tokenUri: "ipfs://QmY1GqprFYvojCcUEKgqHeDj9uhZD9jmYGrQTfA9vAE78J",
    };

    const result = WowCreateTokenInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should successfully parse input without tokenUri", () => {
    const validInput = {
      name: "WowCoin",
      symbol: "WOW",
    };

    const result = WowCreateTokenInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail with missing required fields", () => {
    const invalidInput = {
      symbol: "WOW",
    };
    const result = WowCreateTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(false);
  });

  it("should fail parsing invalid tokenUri", () => {
    const invalidInput = {
      name: "WowCoin",
      symbol: "WOW",
      tokenUri: 12345,
    };
    const result = WowCreateTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(false);
  });
});
