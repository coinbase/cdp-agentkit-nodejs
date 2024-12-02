import { Coinbase, Wallet, WalletCreateOptions } from "@coinbase/coinbase-sdk";

import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";

import { CdpToolkit } from "../toolkits/cdp_toolkit";

import { newWalletMock, newWalletAddressMock } from "./mocks";
import { generateWalletData } from "./utils";

describe("CdpToolkit", () => {
  let agentkit: CdpAgentkit;
  let toolkit: CdpToolkit;
  let wallet: Wallet;

  beforeAll(async () => {
    const walletData = generateWalletData();

    Coinbase.apiClients.address = newWalletAddressMock([walletData.address]);
    Coinbase.apiClients.wallet = newWalletMock(walletData);
    Coinbase.useServerSigner = false;

    wallet = await Wallet.create();
  });

  describe("initialization", () => {
    it("should successfully init with env", async () => {
      const options = {
        cdpApiKeyName: "test-key",
        cdpApiKeyPrivateKey: "test-private-key",
        wallet: wallet,
      };

      await expect(CdpAgentkit.configureWithWallet(options)).resolves.toBeDefined();
    });

    it("should fail init without env", async () => {
      const options = {
        wallet: wallet,
      };

      await expect(CdpAgentkit.configureWithWallet(options)).rejects.toThrow();
    });
  });

  it("should successfully return tools for CDP actions", async () => {
    const options = {
      cdpApiKeyName: "test-key",
      cdpApiKeyPrivateKey: "test-private-key",
      wallet: wallet,
    };

    const agentkit = await CdpAgentkit.configureWithWallet(options);
    const toolkit = new CdpToolkit(agentkit);
    const tools = toolkit.getTools();

    expect(tools).toBeDefined();
    expect(tools.length).toBeGreaterThan(0);
  });
});
