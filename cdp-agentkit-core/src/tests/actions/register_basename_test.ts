import {
  Coinbase,
  ContractInvocation,
  CreateContractInvocationOptions,
  Wallet,
} from "@coinbase/coinbase-sdk";

import { registerBasename, RegisterBasenameInput } from "../../actions/cdp/register_basename";

import { newContractInvocationFactory } from "../factories/contract_invocation";
import { newWalletFactory } from "../factories/wallet";
import { newWalletAddressFactory } from "../factories/wallet_address";
import {
  generateContractInvocationData,
  generateContractInvocationFromData,
} from "../utils/contract_invocation";
import { mockReturnValue, mockReturnRejectedValue } from "../utils/mock";
import { generateWalletData } from "../utils/wallet";

const MOCK_AMMOUNT = 0.123;
const MOCK_BASENAME = "test-basename";

const MOCK_OPTIONS = {
  amount: MOCK_AMMOUNT,
  basename: MOCK_BASENAME,
};

describe("Register Basename Input", () => {
  it("should successfully parse valid input", () => {
    const result = RegisterBasenameInput.safeParse(MOCK_OPTIONS);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_OPTIONS);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = RegisterBasenameInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Register Basename Action", () => {
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
  });

  it("should fail with an error", async () => {
    const error = new Error("Failed to register basename");

    (await wallet.getDefaultAddress()).invokeContract = mockReturnRejectedValue(error)

    const response = await registerBasename(wallet, {...MOCK_OPTIONS});
    const expected = `Error registering basename: ${error.message}`;

    expect(response).toEqual(expected);
  });
});
// TODO: additional network testing?

describe("Register Basename Action on base.eth", () => {
  let contractInvocation: ContractInvocation;
  let contractInvocationOptions: CreateContractInvocationOptions;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletDataOptions = {
      networkId: Coinbase.networks.BaseMainnet
    }

    const walletData = generateWalletData(walletDataOptions);
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).invokeContract = jest
      .fn()
      .mockImplementation(async (params) => {
        const contractInvocationData = generateContractInvocationData(wallet, params);

        contractInvocation = generateContractInvocationFromData(params);
        contractInvocationOptions = params;

        Coinbase.apiClients.contractInvocation = newContractInvocationFactory();
        Coinbase.apiClients.contractInvocation.getContractInvocation =
          mockReturnValue(contractInvocationData);

        return generateContractInvocationFromData(contractInvocationData);
      });
  });

  it("should successfully respond", async () => {
    const response = await registerBasename(wallet, {...MOCK_OPTIONS});
    const expected = `Successfully registered basename ${MOCK_BASENAME}.base.eth for address ${(await wallet.getDefaultAddress()).getId()}`;

    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledWith(
      contractInvocationOptions,
    );
    expect(response).toBe(expected);
  });
});

describe("Register Basename Action on basetest.eth", () => {
  let contractInvocation: ContractInvocation;
  let contractInvocationOptions: CreateContractInvocationOptions;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletDataOptions = {
      networkId: "basetest.eth, or any value not base-mainnet",
    }

    const walletData = generateWalletData(walletDataOptions);
    const walletAddresses = [walletData.address];

    Coinbase.apiClients.address = newWalletAddressFactory(walletAddresses);
    Coinbase.apiClients.wallet = newWalletFactory(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
  });

  beforeEach(async () => {
    (await wallet.getDefaultAddress()).invokeContract = jest
      .fn()
      .mockImplementation(async (params) => {
        const contractInvocationData = generateContractInvocationData(wallet, params);

        contractInvocation = generateContractInvocationFromData(params);
        contractInvocationOptions = params;

        Coinbase.apiClients.contractInvocation = newContractInvocationFactory();
        Coinbase.apiClients.contractInvocation.getContractInvocation =
          mockReturnValue(contractInvocationData);

        return generateContractInvocationFromData(contractInvocationData);
      });
  });

  it("should successfully respond on testnet", async () => {
    const response = await registerBasename(wallet, {...MOCK_OPTIONS});
    const expected = `Successfully registered basename ${MOCK_BASENAME}.basetest.eth for address ${(await wallet.getDefaultAddress()).getId()}`;

    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledTimes(1);
    expect((await wallet.getDefaultAddress()).invokeContract).toHaveBeenCalledWith(
      contractInvocationOptions,
    );
    expect(response).toBe(expected);
  });
});
