import { Wallet } from "@coinbase/coinbase-sdk";

import { deployToken, DeployTokenInput } from "../../actions/cdp/deploy_token";

jest.mock("@coinbase/coinbase-sdk", () => ({
    Wallet: jest.fn(),
}));

const MOCK_TOKEN_NAME = "Test Token";
const MOCK_TOKEN_SYMBOL = "TEST";
const MOCK_TOKEN_SUPPLY = 100;

describe("Deploy Token", () => {
  let contract: any;
  let mockContract: any;
  let mockWallet: jest.Mocked<Wallet>;

  beforeEach(() => {
    mockContract = {
      wait: jest.fn(),
    };

    mockWallet = {
      deployToken: jest.fn(),
    } as unknown as jest.Mocked<Wallet>;

    contract = {
      getContractAddress: jest.fn().mockReturnValue("0x123456789abcdef"),
      getTransaction: jest.fn().mockReturnValue({
        getTransactionLink: jest.fn().mockReturnValue("https://etherscan.io/tx/0xabcdef123456789"),
      }),
    };

    mockContract.wait.mockResolvedValue(contract);
    mockWallet.deployToken.mockResolvedValue(mockContract);
  });

  describe("input", () => {
    it("should successfully parse valid input", () => {
      const validInput = {
        name: MOCK_TOKEN_NAME,
        symbol: MOCK_TOKEN_SYMBOL,
        totalSupply: MOCK_TOKEN_SUPPLY,
      };

      const result = DeployTokenInput.safeParse(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validInput);
    });

    it("sould fail parsing empty input", () => {
      const emptyInput = {};
      const result = DeployTokenInput.safeParse(emptyInput);

      expect(result.success).toBe(false);
    });
  });

  it("should successfully respond", async () => {
    const args = {
      name: MOCK_TOKEN_NAME,
      symbol: MOCK_TOKEN_SYMBOL,
      totalSupply: MOCK_TOKEN_SUPPLY,
    };

    const response = await deployToken(mockWallet, args);

    expect(mockWallet.deployToken).toHaveBeenCalledWith(args);
    expect(mockContract.wait).toHaveBeenCalled();
    expect(response).toContain(`Deployed ERC20 token contract ${MOCK_TOKEN_NAME} (${MOCK_TOKEN_SYMBOL}) with total supply of ${MOCK_TOKEN_SUPPLY} tokens at address ${contract.getContractAddress()}.`);
    expect(response).toContain(`Transaction link: ${contract.getTransaction().getTransactionLink()}`);
  });

  it("should fail with an error", async () => {
    const args = {
      name: MOCK_TOKEN_NAME,
      symbol: MOCK_TOKEN_SYMBOL,
      totalSupply: MOCK_TOKEN_SUPPLY,
    };

    const error = new Error("An error has occured");
    mockWallet.deployToken.mockRejectedValue(error);

    const response = await deployToken(mockWallet, args);

    expect(mockWallet.deployToken).toHaveBeenCalledWith(args);
    expect(response).toContain(`Error deploying token: ${error.message}`);
  });
});
