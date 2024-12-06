# CDP Agentkit Extension - Twitter langchain Toolkit

[![npm version](https://img.shields.io/npm/v/@coinbase/twitter-langchain.svg?style=flat-square)](https://www.npmjs.com/package/@coinbase/twitter-langchain) [![GitHub star chart](https://img.shields.io/github/stars/coinbase/cdp-agentkit-nodejs?style=flat-square)](https://star-history.com/#coinbase/cdp-agentkit-nodejs) [![Open Issues](https://img.shields.io/github/issues-raw/coinbase/cdp-agentkit-nodejs?style=flat-square)](https://github.com/coinbase/cdp-agentkit-nodejs/issues)

This toolkit contains tools that enable an LLM agent to interact with [Twitter](https://developer.x.com/en/docs/x-api). The toolkit provides a wrapper around the Twitter (X) API, allowing agents to perform social operations like posting text.

## Prerequisites

- Node.js 18 or higher
- [OpenAI API Key](https://platform.openai.com/docs/quickstart#create-and-export-an-api-key)
- [Twitter (X) App Developer Keys](https://developer.x.com/en/portal/dashboard)

## Installation

```bash
npm install @coinbase/twitter-langchain
```

## Environment Setup

Set the following environment variables:

```bash
export OPENAI_API_KEY=<your-openai-api-key>
export TWITTER_API_KEY=<your-api-key>
export TWITTER_API_SECRET=<your-api-secret>
export TWITTER_ACCESS_TOKEN=<your-access-token>
export TWITTER_ACCESS_TOKEN_SECRET=<your-access-token-secret>
```

## Usage

### Basic Setup

```typescript
import { TwitterAgentkit, TwitterToolkit } from "@coinbase/twitter-langchain";

// Initialize Twitter Agentkit
const agentkit = new TwitterAgentkit();

// Create toolkit
const toolkit = new TwitterToolkit(agentkit);

// Get available tools
const tools = toolkit.getTools();
```

### Available Tools

The toolkit provides the following tools:

1. **account_details** - Get the authenticated account details
2. **post_tweet** - Post a tweet to the account
3. **post_tweet_reply** - Post a reply to a tweet on Twitter
4. **user_mentions** - Get mentions for a specified user

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
- [CDP Agentkit Langchain Extension API Reference](https://coinbase.github.io/cdp-agentkit-nodejs/cdp-langchain/index.html)
- [CDP Agentkit Twitter Langchain Extension API Reference](https://coinbase.github.io/cdp-agentkit-nodejs/twitter-langchain/index.html)

## License

Apache-2.0
