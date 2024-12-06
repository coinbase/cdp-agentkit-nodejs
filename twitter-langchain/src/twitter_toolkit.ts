import { StructuredToolInterface, BaseToolkit as Toolkit } from "@langchain/core/tools";
import { TWITTER_ACTIONS } from "./actions/index";
import { TwitterAgentkit } from "./twitter_agentkit";
import { TwitterTool } from "./twitter_tool";

/**
 * Twitter (X) Toolkit.
 *
 * Security Note: This toolkit contains tools that can read and modify
 * the state of a service; e.g., by creating, deleting, or updating,
 * reading underlying data.
 *
 * For example, this toolkit can be used to get account details, post tweets,
 * post tweet replies, get user mentions, etc.
 *
 * Setup:
 * You will need to set the following environment variables:
 * ```bash
 * TODO
 * ```
 *
 * Example usage:
 * ```typescript
 * // optional if not available via the ENV
 * const options = {
 *  TODO
 * };
 *
 * const agentkit = await TwitterAgentkit.configureWithOptions(options);
 * const toolkit = new TwitterToolkit(agentkit);
 * const tools = toolkit.getTools();
 *
 * // Available tools include:
 * // - account_details
 * // - post_tweet
 * // - post_tweet_reply
 * // - user_mentions
 * ```
 */
export class TwitterToolkit extends Toolkit {
  tools: StructuredToolInterface[];

  /**
   * Creates a new Twitter (X) Toolkit instance
   *
   * @param agentkit - Twitter (X) agentkit instance
   */
  constructor(agentkit: TwitterAgentkit) {
    super();
    const actions = TWITTER_ACTIONS;
    const tools = actions.map(action => new TwitterTool(action, agentkit));
    this.tools = tools;
    this.tools = [];
  }
}
