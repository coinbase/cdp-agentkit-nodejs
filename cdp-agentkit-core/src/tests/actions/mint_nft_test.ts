import { Coinbase, SmartContract, SmartContractType, Wallet } from "@coinbase/coinbase-sdk";

import { mintNft, MintNftInput } from "../../actions/cdp/actions/mint_nft";

import { newSmartContractFactory } from "../factories/smart_contract";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import { generateWalletData } from "../utils/wallet";

const MOCK_NFT_CONTRACT_ADDRESS = "0x000";
const MOCK_NFT_CONTRACT_DESTINATION = "0x000";

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
  let contract: SmartContract;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
  });

  it("should successfully respond", async () => {});
  it("should fail with an error", async () => {});
});
