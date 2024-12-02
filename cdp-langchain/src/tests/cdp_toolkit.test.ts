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

    const agentkitOptions = {
      cdpApiKeyName: "test-key",
      cdpApiKeyPrivateKey: "test-private-key",
      wallet: wallet,
      // cdpWalletData: JSON.stringify({
      //   ...walletData,
      //   defaultAddressId: (await wallet.getDefaultAddress()).getId(),
      // }),
    };

    agentkit = await CdpAgentkit.configureWithWallet(agentkitOptions);
    toolkit = new CdpToolkit(agentkit);
  });

  describe("ENV", () => {
    beforeAll(async () => {});

    it("should successfully init", () => {});

    it("should fail init", () => {});
  });

  it("should create tools from CDP actions", () => {
    const tools = toolkit.getTools();
    expect(tools).toBeDefined();
    expect(tools.length).toBeGreaterThan(0);
  });
});
