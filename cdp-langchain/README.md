# CDP AgentKit Extension - Langchain Toolkit

[![npm version](https://img.shields.io/npm/v/@coinbase/cdp-langchain.svg?style=flat-square)](https://www.npmjs.com/package/@coinbase/cdp-langchain) [![GitHub star chart](https://img.shields.io/github/stars/coinbase/cdp-agentkit-nodejs?style=flat-square)](https://star-history.com/#coinbase/cdp-agentkit-nodejs) [![Open Issues](https://img.shields.io/github/issues-raw/coinbase/cdp-agentkit-nodejs?style=flat-square)](https://github.com/coinbase/cdp-agentkit-nodejs/issues)

CDP integration with Langchain to enable agentic workflows using the core primitives defined in `cdp-agentkit-core`. This toolkit contains tools that enable an LLM agent to interact with the [Coinbase Developer Platform](https://docs.cdp.coinbase.com/). The toolkit provides a wrapper around the CDP SDK, allowing agents to perform onchain operations like transfers, trades, and smart contract interactions.

## Prerequisites

- Node.js 18 or higher
- [CDP API Key](https://portal.cdp.coinbase.com/access/api)
- [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)

## Installation

```bash
npm install @coinbase/cdp-langchain
```

## Environment Setup

Set the following environment variables:

```bash
export CDP_API_KEY_NAME=<your-api-key-name>
export CDP_API_KEY_PRIVATE_KEY=<your-private-key>
export OPENAI_API_KEY=<your-openai-api-key>
export NETWORK_ID=base-sepolia  # Optional: Defaults to base-sepolia
```

## Usage

### Basic Setup

```typescript
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";

// Initialize CDP AgentKit
const agentkit = await CdpAgentkit.configureWithWallet();

// Create toolkit
const toolkit = new CdpToolkit(agentkit);

// Get available tools
const tools = toolkit.getTools();
```

### Available Tools

The toolkit provides the following tools:

1. **get_wallet_details** - Get details about the user's Wallet
2. **get_balance** - Get balance for specific assets
3. **request_faucet_funds** - Request test tokens from faucet
4. **transfer** - Transfer assets between addresses
5. **trade** - Trade assets (Mainnet only)
6. **deploy_token** - Deploy [ERC-20](https://www.coinbase.com/learn/crypto-glossary/what-is-erc-20) token contracts
7. **mint_nft** - Mint NFTs from existing contracts
8. **deploy_nft** - Deploy new NFT contracts
9. **register_basename** - Register a [Basename](https://www.base.org/names) for the wallet
10. **wow_create_token** - Deploy a token using [Zora's Wow Launcher](https://wow.xyz/mechanics) (Bonding Curve)
11. **wow_buy_token** - Buy [Zora Wow](https://wow.xyz/) ERC-20 memecoin with ETH
12. **wow_sell_token** - Sell [Zora Wow](https://wow.xyz/) ERC-20 memecoin for ETH
13. **wrap_eth** - Wrap ETH as WETH

### Using with an Agent

#### Additional Installations
```bash
npm install @langchain/langgraph @langchain/openai
```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Initialize LLM
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

// Create agent executor
const agent = createReactAgent({
  llm: model,
  tools,
});

// Example usage
const result = await agent.invoke({
  messages: [new HumanMessage("Send 0.005 ETH to john2879.base.eth")],
});

console.log(result.messages[result.messages.length - 1].content);
```

## CDP Toolkit Specific Features

### Wallet Management

The toolkit maintains an MPC wallet that persists between sessions:

```typescript
// Export wallet data
const walletData = await agentkit.exportWallet();

// Import wallet data
const importedAgentkit = await CdpAgentkit.configureWithWallet({ cdpWalletData: walletData });
```

### Network Support

The toolkit supports [multiple networks](https://docs.cdp.coinbase.com/cdp-sdk/docs/networks).

### Gasless Transactions

The following operations support gasless transactions on Base Mainnet:

- USDC transfers
- EURC transfers
- cbBTC transfers

## Examples

Check out `examples/` for inspiration and help getting started:

- [Chatbot](./examples/chatbot/README.md): Interactive chatbot with onchain capabilities

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed setup instructions and contribution guidelines.

## Security and bug reports

The CDP AgentKit team takes security seriously.
See [SECURITY.md](../SECURITY.md) for more information.

## Documentation

- [CDP AgentKit Documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [API Reference: CDP AgentKit LangChain Extension](https://coinbase.github.io/cdp-agentkit-nodejs/cdp-langchain/index.html)

## License

Apache-2.0
