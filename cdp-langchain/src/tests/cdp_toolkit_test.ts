import { Wallet } from "@coinbase/coinbase-sdk";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "../toolkits/cdp_toolkit";

describe("CdpToolkit", () => {
  const WALLET_ID = "0x123456789abcdef";
  const WALLET_SEED = "0xc746290109d0b86162c428be6e27f552";
  const WALLET_JSON = `{"defaultAddressId":"0xabcdef123456789", "seed":"${WALLET_SEED}", "walletId":"${WALLET_ID}"}`;

  let mockWallet: jest.Mocked<Wallet>;

  beforeEach(async () => {
    process.env.CDP_API_KEY_NAME = "test-key";
    process.env.CDP_API_KEY_PRIVATE_KEY = "test-private-key";

    mockWallet = {} as unknown as jest.Mocked<Wallet>;
    jest.spyOn(Wallet, "create").mockResolvedValue(mockWallet);
  });

  describe("initialization", () => {
    it("should successfully init with env", async () => {
      const options = {};
      await expect(CdpAgentkit.configureWithWallet(options)).resolves.toBeDefined();
    });

    it("should successfully init with options and without env", async () => {
      const options = {
        cdpApiKeyName: "test-key",
        cdpApiKeyPrivateKey: "test-private-key",
      };

      process.env.CDP_API_KEY_NAME = "";
      process.env.CDP_API_KEY_PRIVATE_KEY = "";

      await expect(CdpAgentkit.configureWithWallet(options)).resolves.toBeDefined();
    });

    it("should successfully init with wallet data", async () => {
      const options = {
        cdpWalletData: WALLET_JSON,
      };

      jest.spyOn(Wallet, "import").mockResolvedValue(mockWallet);

      expect(await CdpAgentkit.configureWithWallet(options)).toBeDefined();
    });

    it("should fail init without env", async () => {
      const options = {};

      process.env.CDP_API_KEY_NAME = "";
      process.env.CDP_API_KEY_PRIVATE_KEY = "";

      await expect(CdpAgentkit.configureWithWallet(options)).rejects.toThrow();
    });
  });

  it("should successfully return tools for CDP actions", async () => {
    const options = {
      cdpApiKeyName: "test-key",
      cdpApiKeyPrivateKey: "test-private-key",
    };

    const agentkit = await CdpAgentkit.configureWithWallet(options);
    const toolkit = new CdpToolkit(agentkit);
    const tools = toolkit.getTools();

    expect(tools).toBeDefined();
    expect(tools.length).toBeGreaterThan(0);
  });
});
