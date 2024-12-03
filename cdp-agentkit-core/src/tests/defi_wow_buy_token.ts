import { Coinbase, SmartContract, Wallet } from "@coinbase/coinbase-sdk";
import { wowBuyToken, WowBuyTokenInput } from "../actions/cdp/defi/wow/actions/buy_token";
import { getBuyQuote } from "../actions/cdp/defi/wow/utils";
import { getHasGraduated } from "../actions/cdp/defi/wow/uniswap/utils";

const MOCK_CONTRACT_ADDRESS = "0xabcdef123456789";
const MOCK_AMOUNT_ETH_IN_WEI = "100000000000000000"; // 0.1 ETH
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

describe("Wow Buy Token Action", () => {
const NETWORK_ID = Coinbase.networks.BaseSepolia;
const TRANSACTION_HASH = "0xghijkl987654321";
const TRANSACTION_LINK = `https://etherscan.io/tx/${TRANSACTION_HASH}`;

  let mockWallet: jest.Mocked<Wallet>;
  let mockWalletResult: any;

  beforeEach(() => {
    mockWallet = {
      invokeContract: jest.fn(),
      getNetworkId: jest.fn().mockReturnValue(NETWORK_ID),
      getDefaultAddress: jest.fn().mockResolvedValue({
        getId: jest.fn().mockReturnValue("0xdefaultaddress"),
      }),
    } as unknown as jest.Mocked<Wallet>;

    mockWalletResult = {
      wait: jest.fn(),
    };
  });

  it("should successfully buy tokens", async () => {
    const args = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
      amountEthInWei: MOCK_AMOUNT_ETH_IN_WEI,
    };

    const mockInvocation = {
      getTransaction: jest.fn().mockReturnValue({
        getTransactionHash: jest.fn().mockReturnValue(TRANSACTION_HASH),
      }),
    };

    mockWallet.invokeContract.mockResolvedValue(mockInvocation);
    jest.spyOn(getBuyQuote, 'getBuyQuote').mockResolvedValue("1000000000000000000"); // Mocking the buy quote
    jest.spyOn(getHasGraduated, 'getHasGraduated').mockResolvedValue(true); // Mocking graduation check

    const response = await wowBuyToken(mockWallet, args);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(response).toContain(`Purchased WoW ERC20 memecoin with transaction hash: ${TRANSACTION_HASH}`);
  });

  it("should fail with an error", async () => {
    const args = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
      amountEthInWei: MOCK_AMOUNT_ETH_IN_WEI,
    };

    const error = new Error("An error has occurred");
    mockWallet.invokeContract.mockRejectedValue(error);

    const response = await wowBuyToken(mockWallet, args);

    expect(mockWallet.invokeContract).toHaveBeenCalled();
    expect(response).toContain(`Error buying Zora Wow ERC20 memecoin ${error.message}`);
  });
});

