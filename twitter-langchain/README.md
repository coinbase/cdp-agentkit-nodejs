# CDP Agentkit Extension - Twitter langchain Toolkit

[![npm version](https://img.shields.io/npm/v/@coinbase/twitter-langchain.svg?style=flat-square)](https://www.npmjs.com/package/@coinbase/twitter-langchain) [![GitHub star chart](https://img.shields.io/github/stars/coinbase/cdp-agentkit?style=flat-square)](https://star-history.com/#coinbase/cdp-agentkit) [![Open Issues](https://img.shields.io/github/issues-raw/coinbase/cdp-agentkit?style=flat-square)](https://github.com/coinbase/cdp-agentkit/issues)

CDP integration with Langchain to enable agentic workflows using the core primitives defined in `twitter-langchain`. This toolkit contains tools that enable an LLM agent to interact with the [Twitter (X) Platform](TODO). The toolkit provides a wrapper around the Twitter (X) SDK, allowing agents to perform operations like post tweet, retrieve mentions, and post replies.

## Prerequisites

- Node.js 18 or higher
- [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)
- [Twitter (X) API Keys](TODO)

## Installation

```bash
npm install @coinbase/twitter-langchain
```

## Environment Setup

Set the following environment variables:

```bash
export OPENAI_API_KEY=<your-openai-api-key>
TODO
```

## Usage

### Basic Setup

```typescript
import { TwitterAgentkit, TwitterToolkit } from "@coinbase/twitter-langchain";

// Initialize Twitter Agentkit
const agentkit = TwitterAgentkit.configureWithOptions();

// Create toolkit
const toolkit = new TwitterToolkit(agentkit);

// Get available tools
const tools = toolkit.getTools();
```

### Available Tools

The toolkit provides the following tools:

1. **account_details** - TODO
2. **post_tweet** - TODO
3. **post_reply** - TODO
4. **user_mentions** - TODO

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
  input: "please post 'hello, world!' to twitter"
});

console.log(result.output);
```

## Examples

Check out `examples/` for inspiration and help getting started:

- [Chatbot](./examples/chatbot/README.md): Interactive chatbot with Twitter (X) capabilities

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed setup instructions and contribution guidelines.

## Documentation

- [CDP Agentkit Documentation](https://docs.cdp.coinbase.com/agentkit/docs/welcome)
- [CDP Agentkit Langchain Extension API Reference](https://coinbase.github.io/cdp-agentkit/cdp-langchain/index.html)
- [CDP Agentkit Twitter Langchain Extension API Reference](TODO)

## License

Apache-2.0
