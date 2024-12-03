# CDP Agentkit Extension - Langchain Toolkit

[![npm version](https://img.shields.io/npm/v/@coinbase/cdp-langchain.svg?style=flat-square)](https://www.npmjs.com/package/@coinbase/cdp-langchain) [![GitHub star chart](https://img.shields.io/github/stars/coinbase/cdp-agentkit?style=flat-square)](https://star-history.com/#coinbase/cdp-agentkit) [![Open Issues](https://img.shields.io/github/issues-raw/coinbase/cdp-agentkit?style=flat-square)](https://github.com/coinbase/cdp-agentkit/issues)

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

// Initialize CDP Agentkit
const agentkit = CdpAgentkit.configureWithWallet();

// Create toolkit
const toolkit = new CdpToolkit(agentkit);

// Get available tools
const tools = toolkit.getTools();
```

### Available Tools

The toolkit provides the following tools:

1. **get_wallet_details** - Get details about the MPC Wallet
2. **get_balance** - Get balance for specific assets
3. **request_faucet_funds** - Request test tokens from faucet
4. **transfer** - Transfer assets between addresses
5. **trade** - Trade assets (Mainnet only)
6. **deploy_token** - Deploy ERC-20 token contracts
7. **mint_nft** - Mint NFTs from existing contracts
8. **deploy_nft** - Deploy new NFT contracts
9. **register_basename** - Register a basename for the wallet
10. **wow_create_token** - Deploy a token using Zora's Wow Launcher (Bonding Curve)
11. **wow_buy_token** - Buy Zora Wow ERC20 memecoin with ETH
12. **wow_sell_token** - Sell Zora Wow ERC20 memecoin for ETH

### Using with an Agent

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

// Initialize LLM
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

// Create agent executor
const executor = await initializeAgentExecutorWithOptions(toolkit.getTools(), model, {
  agentType: "chat-conversational-react-description",
  verbose: true,
});

// Example usage
const result = await executor.invoke({
  input: "Send 0.005 ETH to john2879.base.eth",
});

console.log(result.output);
```

## CDP Toolkit Specific Features

### Wallet Management

The toolkit maintains an MPC wallet that persists between sessions:

```typescript
// Export wallet data
const walletData = await agentkit.exportWallet();

// Import wallet data
const importedAgentkit = CdpAgentkit.configureWithWallet({ cdpWalletData: walletData });
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

## Documentation

- [CDP Agentkit Documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [CDP Agentkit Langchain Extension API Reference](https://coinbase.github.io/cdp-agentkit/cdp-langchain/index.html)

## License

Apache-2.0
