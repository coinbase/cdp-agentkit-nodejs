import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";

import { CdpToolkit } from "../toolkits/cdp_toolkit";

describe("CdpToolkit", () => {
  let agentkit: CdpAgentkit;
  let toolkit: CdpToolkit;
  let mockWallet: jest.Mocked<Wallet>;

  beforeAll(async () => {
    mockWallet = {} as unknown as jest.Mocked<Wallet>;
  });

  describe("initialization", () => {
    it("should successfully init with env", async () => {
      const options = {
        cdpApiKeyName: "test-key",
        cdpApiKeyPrivateKey: "test-private-key",
        wallet: mockWallet,
      };

      await expect(CdpAgentkit.configureWithWallet(options)).resolves.toBeDefined();
    });

    it("should fail init without env", async () => {
      const options = {
        wallet: mockWallet,
      };

      await expect(CdpAgentkit.configureWithWallet(options)).rejects.toThrow();
    });
  });

  it("should successfully return tools for CDP actions", async () => {
    const options = {
      cdpApiKeyName: "test-key",
      cdpApiKeyPrivateKey: "test-private-key",
      wallet: mockWallet,
    };

    const agentkit = await CdpAgentkit.configureWithWallet(options);
    const toolkit = new CdpToolkit(agentkit);
    const tools = toolkit.getTools();

    expect(tools).toBeDefined();
    expect(tools.length).toBeGreaterThan(0);
  });
});
