import { Coinbase, Wallet, WalletAddress } from "@coinbase/coinbase-sdk";

import { getWalletDetails, GetWalletDetailsInput } from "../../actions/cdp/get_wallet_details";

describe("Wallet Details Input", () => {
  it("should successfully parse empty input", () => {
    const emptyInput = {};
    const result = GetWalletDetailsInput.safeParse(emptyInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(emptyInput);
  });
});

describe("Wallet Details Action", () => {
  const MOCK_ADDRESS_ID = "0xabcdef123456789";
  const MOCK_NETWORK_ID = Coinbase.networks.BaseSepolia;
  const MOCK_WALLET_ID = "0x123456789abcdef";

  let mockWallet: jest.Mocked<Wallet>;
  let mockWalletAddress: jest.Mocked<WalletAddress>;

  beforeEach(() => {
    mockWallet = {
      getDefaultAddress: jest.fn(),
      getId: jest.fn().mockReturnValue(MOCK_WALLET_ID),
      getNetworkId: jest.fn().mockReturnValue(MOCK_NETWORK_ID),
    } as unknown as jest.Mocked<Wallet>;

    mockWalletAddress = {
      getId: jest.fn().mockReturnValue(MOCK_ADDRESS_ID),
    } as unknown as jest.Mocked<WalletAddress>;

    mockWallet.getDefaultAddress.mockResolvedValue(mockWalletAddress);
  });

  it("should successfully respond", async () => {
    const args = {};
    const response = await getWalletDetails(mockWallet, args);

    expect(mockWallet.getDefaultAddress).toHaveBeenCalled();
    expect(response).toContain(`Wallet: ${MOCK_WALLET_ID}`);
    expect(response).toContain(`on network: ${MOCK_NETWORK_ID}`);
    expect(response).toContain(`with default address: ${MOCK_ADDRESS_ID}`);
  });

  it("should fail with an error", async () => {
    const args = {};

    const error = new Error("An error has occured");
    mockWallet.getDefaultAddress.mockRejectedValue(error);

    const response = await getWalletDetails(mockWallet, args);

    expect(mockWallet.getDefaultAddress).toHaveBeenCalled();
    expect(response).toContain(`Error getting wallet details: ${error.message}`);
  });
});
