import { Wallet } from "@coinbase/coinbase-sdk";

import { deployNft, DeployNftInput } from "../../actions/cdp/deploy_nft";

jest.mock("@coinbase/coinbase-sdk", () => ({
    Wallet: jest.fn(),
}));

const MOCK_NFT_BASE_URI = "https://www.test.xyz/metadata/";
const MOCK_NFT_NAME = "Test Token";
const MOCK_NFT_SYMBOL = "TEST";

describe("Deploy NFT Action", () => {
  let contract: any;
  let mockContract: any;
  let mockWallet: jest.Mocked<Wallet>;

  beforeEach(() => {
    mockContract = {
      wait: jest.fn(),
    };

    mockWallet = {
      deployNFT: jest.fn(),
      getNetworkId: jest.fn().mockReturnValue("testnet"),
    } as unknown as jest.Mocked<Wallet>;

    contract = {
      getContractAddress: jest.fn().mockReturnValue("0x123456789abcdef"),
      getTransaction: jest.fn().mockReturnValue({
        getTransactionHash: jest.fn().mockReturnValue("0xabcdef123456789"),
        getTransactionLink: jest.fn().mockReturnValue("https://etherscan.io/tx/0xabcdef123456789"),
      }),
    };

    mockContract.wait.mockResolvedValue(contract);
    mockWallet.deployNFT.mockResolvedValue(mockContract);
  });

  describe("input", () => {
    beforeEach(() => {
    });

    it("should successfully parse valid input", () => {
      const validInput = {
        name: "token-name",
        symbol: "token-symbol",
        baseURI: "https://token-base-uri",
      };

      const result = DeployNftInput.safeParse(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validInput);
    });

    it("sould fail parsing empty input", () => {
      const emptyInput = {};
      const result = DeployNftInput.safeParse(emptyInput);

      expect(result.success).toBe(false);
    });
  });

  it("should successfully respond", async () => {
    const args= {
      name: MOCK_NFT_NAME,
      symbol: MOCK_NFT_SYMBOL,
      baseURI: MOCK_NFT_BASE_URI,
    };

    const response = await deployNft(mockWallet, args);

    expect(mockWallet.deployNFT).toHaveBeenCalledWith(args);
    expect(mockContract.wait).toHaveBeenCalled();
    expect(response).toContain(`Deployed NFT Collection ${MOCK_NFT_NAME} to address ${contract.getContractAddress()} on network ${mockWallet.getNetworkId()}.`);
    expect(response).toContain(`Transaction hash for the deployment: ${contract.getTransaction().getTransactionHash()}`);
    expect(response).toContain(`Transaction link for the deployment: ${contract.getTransaction().getTransactionLink()}`);
  });

  it("should fail with an error", async () => {
    const args= {
      name: MOCK_NFT_NAME,
      symbol: MOCK_NFT_SYMBOL,
      baseURI: MOCK_NFT_BASE_URI,
    };

    const error = new Error("An error has occured");
    mockWallet.deployNFT.mockRejectedValue(error);

    const response = await deployNft(mockWallet, args);

    expect(mockWallet.deployNFT).toHaveBeenCalledWith(args);
    expect(response).toContain(`Error deploying NFT: ${error.message}`);
  });
});
