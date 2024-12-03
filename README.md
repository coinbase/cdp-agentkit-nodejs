# CDP Agentkit.js

[![npm downloads](https://img.shields.io/npm/dm/@coinbase/cdp-agentkit-core?style=flat-square)](https://www.npmjs.com/package/@coinbase/cdp-agentkit-core)
[![GitHub star chart](https://img.shields.io/github/stars/coinbase/cdp-agentkit-nodejs?style=flat-square)](https://star-history.com/#coinbase/cdp-agentkit-nodejs)
[![Open Issues](https://img.shields.io/github/issues-raw/coinbase/cdp-agentkit-nodejs?style=flat-square)](https://github.com/coinbase/cdp-agentkit-nodejs/issues)

The **Coinbase Developer Platform (CDP) Agentkit for Node.js** simplifies bringing your AI Agents onchain. Every AI Agent deserves a crypto wallet!

## Key Features
- **Framework-agnostic**: Common AI Agent primitives that can be used with any AI framework.
- **LangChain.js integration**: Seamless integration with [LangChain.js](https://js.langchain.com/docs/introduction/) for easy agentic workflows. More frameworks coming soon!
- **Support for various on-chain actions**:

  - Faucet for testnet funds
  - Getting wallet details and balances
  - Transferring and trading tokens
  - Registering [Basenames](https://www.base.org/names)
  - Deploying [ERC-20](https://www.coinbase.com/learn/crypto-glossary/what-is-erc-20) tokens
  - Deploying [ERC-721](https://www.coinbase.com/learn/crypto-glossary/what-is-erc-721) tokens and minting NFTs
  - Buying and selling [Zora Wow](https://wow.xyz/) ERC-20 coins
  - Deploying tokens on [Zora's Wow Launcher](https://wow.xyz/mechanics) (Bonding Curve)
  
  Or [add your own](./CONTRIBUTING.md#adding-an-action-to-agentkit-core)!

## Examples
Check out [cdp-langchain/examples](./cdp-langchain/examples) for inspiration and help getting started!
- [Chatbot](./cdp-langchain/examples/chatbot/README.md): Simple example of a Chatbot that can perform complex onchain interactions, using OpenAI.

## Repository Structure
CDP Agentkit Node.js is organized as a [monorepo](https://en.wikipedia.org/wiki/Monorepo) that contains multiple packages.

### @coinbase/cdp-agentkit-core
Core primitives and framework-agnostic tools that are meant to be composable and used via CDP Agentkit framework extensions (ie, `cdp-langchain`).
See [CDP Agentkit Core](./cdp-agentkit-core/README.md) to get started!

### @coinbase/cdp-langchain
LangChain.js Toolkit extension of CDP Agentkit. Enables agentic workflows to interact with onchain actions.
See [CDP LangChain](./cdp-langchain/README.md) to get started!

## Contributing
CDP Agentkit welcomes community contributions.
See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## Security and bug reports
The CDP Agentkit team takes security seriously.
See [SECURITY.md](SECURITY.md) for more information.

## Documentation
- [CDP Agentkit Documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [API Reference: CDP Agentkit Core](https://coinbase.github.io/cdp-agentkit-nodejs/cdp-agentkit-core/index.html)
- [API Reference: CDP Agentkit LangChain Extension](https://coinbase.github.io/cdp-agentkit-nodejs/cdp-langchain/index.html)
