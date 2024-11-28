import {
  Coinbase,
  ContractInvocation,
  CreateContractInvocationOptions,
  Wallet,
} from "@coinbase/coinbase-sdk";

import { mintNft, MintNftInput } from "../../actions/cdp/actions/mint_nft";

import { newContractInvocationFactory } from "../factories/contract_invocation";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import {
  generateContractInvocationData,
  generateContractInvocationFromData,
} from "../utils/contract_invocation";
import { mockReturnValue, mockReturnRejectedValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_NFT_CONTRACT_ADDRESS = "0x123";
const MOCK_NFT_CONTRACT_DESTINATION = "0x321";

const MOCK_OPTIONS = {
  contractAddress: MOCK_NFT_CONTRACT_ADDRESS,
  destination: MOCK_NFT_CONTRACT_DESTINATION,
};

describe("Mint NFT Input", () => {
  it("should successfully parse valid input", () => {
    const result = MintNftInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("sould fail parsing empty input", () => {
    const emptyInput = {};
    const result = MintNftInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Mint NFT Action", () => {
  let contractInvocation: ContractInvocation;
  let contractInvocationOptions: CreateContractInvocationOptions;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();

    contractInvocationOptions = {
      contractAddress: MOCK_NFT_CONTRACT_ADDRESS,
      method: "mint",
      args: {
        to: MOCK_NFT_CONTRACT_DESTINATION,
        quantity: "1",
      },
    };

    const contractInvocationDataOptions = {
      ...contractInvocationOptions,
    };

    const contractInvocationData = generateContractInvocationData(
      wallet,
      contractInvocationDataOptions,
    );

    contractInvocation = generateContractInvocationFromData(contractInvocationData);

    Coinbase.apiClients.contractInvocation = newContractInvocationFactory();
    Coinbase.apiClients.contractInvocation.getContractInvocation =
      mockReturnValue(contractInvocationData);
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).invokeContract = jest
      .fn()
      .mockResolvedValue(contractInvocation);
  });

  it("should successfully respond", async () => {
    const response = await mintNft(
      wallet,
      MOCK_NFT_CONTRACT_ADDRESS,
      MOCK_NFT_CONTRACT_DESTINATION,
    );

    const expected = `Minted NFT from contract ${MOCK_NFT_CONTRACT_ADDRESS} to address ${MOCK_NFT_CONTRACT_DESTINATION} on network ${wallet.getNetworkId()}.\nTransaction hash for the mint: ${contractInvocation.getTransaction().getTransactionHash()}\nTransaction link for the mint: ${contractInvocation.getTransaction().getTransactionLink()}`;

    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledWith(
      contractInvocationOptions,
    );
    expect(response).toBe(expected);
  });

  it("should fail with an error", async () => {
    const error = new Error("Failed to mint NFT");

    Coinbase.apiClients.contractInvocation!.getContractInvocation = mockReturnRejectedValue(error);

    const response = await mintNft(
      wallet,
      MOCK_NFT_CONTRACT_ADDRESS,
      MOCK_NFT_CONTRACT_DESTINATION,
    );

    const expected = `Error minting NFT: ${error.message}`;

    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledWith(
      contractInvocationOptions,
    );
    expect(response).toEqual(expected);
  });
});
