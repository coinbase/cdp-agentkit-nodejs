import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

import { registerBasename, RegisterBasenameInput } from "../../actions/cdp/register_basename";

const MOCK_AMMOUNT = 0.123;
const MOCK_BASENAME = "test-basename";

describe("Register Basename Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      amount: MOCK_AMMOUNT,
      basename: MOCK_BASENAME,
    };

    const result = RegisterBasenameInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = RegisterBasenameInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Register Basename Action", () => {
  /**
   * This is the default network.
   */
  const MOCK_NETWORK_ID = Coinbase.networks.BaseMainnet;

  /**
   * This is a 40 character hexadecimal string that requires lowercase alpha characters.
   */
  const MOCK_ADDRESS_ID = "0xe6b2af36b3bb8d47206a129ff11d5a2de2a63c83";

  let mockWallet: jest.Mocked<Wallet>;
  let mockWalletResult: any;

  beforeEach(() => {
    mockWallet = {
      getDefaultAddress: jest.fn().mockResolvedValue({
        getId: jest.fn().mockReturnValue(MOCK_ADDRESS_ID),
      }),
      getNetworkId: jest.fn().mockReturnValue(MOCK_NETWORK_ID),
      invokeContract: jest.fn(),
    } as unknown as jest.Mocked<Wallet>;

    mockWalletResult = {
      wait: jest.fn(),
    };

    mockWalletResult.wait.mockResolvedValue({});
    mockWallet.invokeContract.mockResolvedValue(mockWalletResult);
  });

  it(`should Successfully respond with ${MOCK_BASENAME}.base.eth for network: base-mainnet`, async () => {
    const args = {
      amount: MOCK_AMMOUNT,
      basename: MOCK_BASENAME,
    };

    const response = await registerBasename(mockWallet, args);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(mockWalletResult.wait).toHaveBeenCalled();
    expect(response).toContain(`Successfully registered basename ${MOCK_BASENAME}.base.eth`);
    expect(response).toContain(`for address ${MOCK_ADDRESS_ID}`);
  });

  it(`should Successfully respond with ${MOCK_BASENAME}.basetest.eth for any other network`, async () => {
    const args = {
      amount: MOCK_AMMOUNT,
      basename: MOCK_BASENAME,
    };

    mockWallet.getNetworkId.mockReturnValue("anything-else");

    const response = await registerBasename(mockWallet, args);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(mockWalletResult.wait).toHaveBeenCalled();
    expect(response).toContain(`Successfully registered basename ${MOCK_BASENAME}.basetest.eth`);
    expect(response).toContain(`for address ${MOCK_ADDRESS_ID}`);
  });

  it("should fail with an error", async () => {
    const args = {
      amount: MOCK_AMMOUNT,
      basename: MOCK_BASENAME,
    };

    const error = new Error("Failed to register basename");
    mockWallet.invokeContract.mockRejectedValue(error);

    const response = mockWallet.invokeContract.mockRejectedValue(error);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(`Error registering basename: ${error.message}`);
  });
});
