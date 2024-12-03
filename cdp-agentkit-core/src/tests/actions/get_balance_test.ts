import { Wallet, WalletAddress } from "@coinbase/coinbase-sdk";

import { getBalance, GetBalanceInput } from "../../actions/cdp/get_balance";

jest.mock("@coinbase/coinbase-sdk", () => ({
    Wallet: jest.fn(),
}));

const MOCK_ASSET_ID = crypto.randomUUID();
const MOCK_BALANCE = 1000000000000000000;

describe("Get Balance Action", () => {
  let addresses: any;
  let mockWallet: jest.Mocked<Wallet>;

  beforeEach(() => {
    addresses = [
      {
        getId: jest.fn().mockReturnValue(crypto.randomUUID()),
        getBalance: jest.fn().mockReturnValue(MOCK_BALANCE),
      } as unknown as jest.Mocked<WalletAddress>,
      {
        getId: jest.fn().mockReturnValue(crypto.randomUUID()),
        getBalance: jest.fn().mockReturnValue(0.0),
      } as unknown as jest.Mocked<WalletAddress>,
      {
        getId: jest.fn().mockReturnValue(crypto.randomUUID()),
        getBalance: jest.fn().mockReturnValue(MOCK_BALANCE),
      } as unknown as jest.Mocked<WalletAddress>,
    ];

    mockWallet = {
      getId: jest.fn().mockReturnValue(crypto.randomUUID()),
      listAddresses: jest.fn(),
    } as unknown as jest.Mocked<Wallet>;


    mockWallet.listAddresses.mockResolvedValue(addresses);
  });

  describe("input", () => {
    it("should successfully parse valid input", () => {
      const validInput = {
        assetId: MOCK_ASSET_ID,
      };

      const result = GetBalanceInput.safeParse(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validInput);
    });

    it("sould fail parsing empty input", () => {
      const emptyInput = {};
      const result = GetBalanceInput.safeParse(emptyInput);

      expect(result.success).toBe(false);
    });
  });

  it("should successfully respond", async () => {
    const args = {
      assetId: MOCK_ASSET_ID,
    };

    const response = await getBalance(mockWallet, args);

    expect(mockWallet.listAddresses).toHaveBeenCalledWith();
    addresses.forEach(address => {
      expect(address.getBalance).toHaveBeenCalledWith(MOCK_ASSET_ID);
      expect(response).toContain(`${address.getId()}: ${address.getBalance()}`);
    });
    expect(response).toContain(`Balances for wallet ${mockWallet.getId()}`);
  });

  it("should fail with an error", async () => {
    const error = new Error("An error has occured");
    addresses[0].getBalance.mockRejectedValue(error);

    const response = await getBalance(mockWallet, { assetId: MOCK_ASSET_ID });

    expect(mockWallet.listAddresses).toHaveBeenCalled();
    expect(response).toContain(`Error getting balance for all addresses in the wallet: ${error.message}`);
  });
});

// describe("Get Balance Action", () => {
//   let addresses: any;
//   let mockResult: any;
//   let mockWallet: jest.Mocked<Wallet>;

//   beforeEach(() => {
//     mockResult = {
//       wait: jest.fn(),
//     };

//     mockWallet = {
//       listAddresses: jest.fn(),
//     } as unknown as jest.Mocked<Wallet>;

//     // addresses = [
//     //   { getBalance: wait: jest.fn().mockReturnValue },
//     // ];

//     mockResult.wait.mockResolvedValue(addresses);
//     mockWallet.listAddresses.mockResolvedValue(mockResult);
//   });

//   describe("input", () => {
//     it("should successfully parse valid input", () => {
//       const validInput = {
//         assetId: MOCK_ASSET_ID,
//       };

//       const result = GetBalanceInput.safeParse(validInput);

//       expect(result.success).toBe(true);
//       expect(result.data).toEqual(validInput);
//     });

//     it("sould fail parsing empty input", () => {
//       const emptyInput = {};
//       const result = GetBalanceInput.safeParse(emptyInput);

//       expect(result.success).toBe(false);
//     });
//   });

//   it("should successfully respond", async () => {
//     // let expectedLines: string[] = [];

//     // wallet.listAddresses = jest.fn().mockResolvedValue(walletAddresses);
//     // walletAddresses.forEach(address => {
//     //   address.getBalance = jest.fn().mockResolvedValue(1.0);
//     //   expectedLines.push(`${address.getId()}: 1`);
//     // });

//     // const response = await getBalance(wallet, validInput);
//     // const expected = `Balances for wallet ${wallet.getId()}:\n${expectedLines.join("\n")}`;

//     // expect(wallet.listAddresses).toHaveBeenCalledTimes(1);
//     // expect(response).toEqual(expected);
//   });

//   // it("should fail with an API Error error", async () => {
//   //   const error = new Error("API Error");

//   //   wallet.listAddresses = mockReturnRejectedValue(error);

//   //   const response = await getBalance(wallet, validInput);
//   //   const expected = `Error getting balance for all addresses in the wallet: ${error.message}`;

//   //   expect(wallet.listAddresses).toHaveBeenCalledTimes(1);
//   //   expect(response).toEqual(expected);
//   // });
// });
