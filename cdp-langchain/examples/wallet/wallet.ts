import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";

dotenv.config();

/**
 * Initialize the CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgentkit() {
  const config = {};
  const agentkit = await CdpAgentkit.configureWithWallet(config);

  return { agentkit, config };
}

/**
 * Import wallet
 */
async function main() {
  console.log("initializing agent...");
  const { agentkit, config } = await initializeAgentkit();

  const walletData = await agentkit.exportWallet();

  console.log("ensuring wallet...");
  const wallet = JSON.parse(walletData);

  console.log("wallet Id:", wallet.walletId);
  console.log("wallet address:", wallet.defaultAddressId);
  console.log("wallet network:", wallet.networkId);
  console.log("wallet seed:", wallet.seed);
}

if (require.main === module) {
  main().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
