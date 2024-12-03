import { Coinbase, ContractInvocation, Wallet } from "@coinbase/coinbase-sdk";
import { wowCreateToken, WowCreateTokenInput } from "../actions/cdp/defi/wow/actions/create_token";

const MOCK_NAME = "Test Token";
const MOCK_SYMBOL = "TEST";
const MOCK_URI = "ipfs://QmY1GqprFYvojCcUEKgqHeDj9uhZD9jmYGrQTfA9vAE78J";

describe("Wow Create Token Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      name: MOCK_NAME,
      symbol: MOCK_SYMBOL,
      tokenUri: MOCK_URI,
    };

    const result = WowCreateTokenInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should successfully parse input without tokenUri", () => {
    const validInput = {
      name: MOCK_NAME,
      symbol: MOCK_SYMBOL,
    };

    const result = WowCreateTokenInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail with missing required fields", () => {
    const invalidInput = {
      symbol: MOCK_SYMBOL,
    };
    const result = WowCreateTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(false);
  });

  it("should fail with invalid tokenUri", () => {
    const invalidInput = {
      name: MOCK_NAME,
      symbol: MOCK_SYMBOL,
      tokenUri: 12345,
    };
    const result = WowCreateTokenInput.safeParse(invalidInput);

    expect(result.success).toBe(false);
  });
});

describe("Wow Create Token Action", () => {
  const NETWORK_ID = Coinbase.networks.BaseSepolia;
  const TRANSACTION_HASH = "0xghijkl987654321";

  let mockContractInvocation: any;
  let mockWallet: jest.Mocked<Wallet>;

  beforeEach(() => {
    mockWallet = {
      invokeContract: jest.fn(),
      getDefaultAddress: jest.fn().mockResolvedValue({
        getId: jest.fn().mockReturnValue(TRANSACTION_HASH),
      }),
      getNetworkId: jest.fn().mockReturnValue(NETWORK_ID),
    } as unknown as jest.Mocked<Wallet>;

    mockContractInvocation = {
      wait: jest.fn().mockResolvedValue({
        getTransaction: jest.fn().mockReturnValue({
          getTransactionHash: jest.fn().mockReturnValue(TRANSACTION_HASH),
        }),
      }),
    } as unknown as jest.Mocked<ContractInvocation>;

    mockWallet.invokeContract.mockResolvedValue(mockContractInvocation);
  });

  it("should successfully create a token", async () => {
    const args = {
      name: MOCK_NAME,
      symbol: MOCK_SYMBOL,
      tokenUri: MOCK_URI,
    };

    const response = await wowCreateToken(mockWallet, args);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(mockContractInvocation.wait).toHaveBeenCalled();
    expect(response).toContain(`Created WoW ERC20 memecoin ${MOCK_NAME}`);
    expect(response).toContain(`with symbol ${MOCK_SYMBOL}`);
    expect(response).toContain(`on network ${NETWORK_ID}`);
    expect(response).toContain(`Transaction hash for the token creation: ${TRANSACTION_HASH}`);
  });

  it("should handle errors when creating a token", async () => {
    const args = {
      name: MOCK_NAME,
      symbol: MOCK_SYMBOL,
      tokenUri: MOCK_URI,
    };

    const error = new Error("An error has occurred");
    mockWallet.invokeContract.mockRejectedValue(error);

    const response = await wowCreateToken(mockWallet, args);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(response).toContain(`Error creating Zora Wow ERC20 memecoin: ${error}`);
  });
});
