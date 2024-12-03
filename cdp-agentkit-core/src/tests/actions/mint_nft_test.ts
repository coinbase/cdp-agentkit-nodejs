import { Coinbase, ContractInvocation, Transaction, Wallet } from "@coinbase/coinbase-sdk";

import { mintNft, MintNftInput } from "../../actions/cdp/mint_nft";

const MOCK_CONTRACT_ADDRESS = "0x123456789abcdef";
const MOCK_CONTRACT_DESTINATION = "0xabcdef123456789";
const MOCK_TRANSACTION_HASH = "0xghijkl987654321";
const MOCK_TRANSACTION_LINK = `https://etherscan.io/tx/${MOCK_TRANSACTION_HASH}`;
const MOCK_WALLET_NETWORK_ID = Coinbase.networks.BaseSepolia;

describe("Mint NFT Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
      destination: MOCK_CONTRACT_DESTINATION,
    };

    const result = MintNftInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("sould fail parsing empty input", () => {
    const emptyInput = {};
    const result = MintNftInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Mint NFT Action", () => {
  let contractInvocation: jest.Mocked<ContractInvocation>;
  let contractInvocationTransaction: jest.Mocked<Transaction>;
  let mockWallet: jest.Mocked<Wallet>;
  let mockWalletResult: any;

  beforeEach(() => {
    mockWallet = {
      invokeContract: jest.fn(),
      getNetworkId: jest.fn().mockReturnValue(MOCK_WALLET_NETWORK_ID),
    } as unknown as jest.Mocked<Wallet>;

    mockWalletResult = {
      wait: jest.fn(),
    };

    contractInvocation = {
      getTransaction: jest.fn(),
    } as unknown as jest.Mocked<ContractInvocation>;

    contractInvocationTransaction = {
      getTransactionHash: jest.fn(),
      getTransactionLink: jest.fn(),
    } as unknown as jest.Mocked<Transaction>;

    contractInvocationTransaction.getTransactionHash.mockReturnValue(MOCK_TRANSACTION_HASH);
    contractInvocationTransaction.getTransactionLink.mockReturnValue(MOCK_TRANSACTION_LINK);

    contractInvocation.getTransaction.mockReturnValue(contractInvocationTransaction);

    mockWalletResult.wait.mockResolvedValue(contractInvocation);
    mockWallet.invokeContract.mockResolvedValue(mockWalletResult);
  });

  it("should successfully respond", async () => {
    const args = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
      destination: MOCK_CONTRACT_DESTINATION,
    };

    const response = await mintNft(mockWallet, args);

    expect(response).toContain(`Minted NFT from contract ${MOCK_CONTRACT_ADDRESS}`);
    expect(response).toContain(`to address ${MOCK_CONTRACT_DESTINATION}`);
    expect(response).toContain(`on network ${mockWallet.getNetworkId()}`);
    expect(response).toContain(`Transaction hash for the mint: ${MOCK_TRANSACTION_HASH}`);
    expect(response).toContain(`Transaction link for the mint: ${MOCK_TRANSACTION_LINK}`);
  });

  it("should fail with an error", async () => {
    const args = {
      contractAddress: MOCK_CONTRACT_ADDRESS,
      destination: MOCK_CONTRACT_DESTINATION,
    };

    const error = new Error("An error has occured");
    mockWallet.invokeContract.mockRejectedValue(error);

    const response = await mintNft(mockWallet, args);
    expect(response).toContain(`Error minting NFT: ${error.message}`);
  });
});
