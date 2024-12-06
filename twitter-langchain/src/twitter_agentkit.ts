import { TwitterApi, TwitterApiTokens } from "twitter-api-v2";
import { z } from "zod";

import { version } from "../package.json";
import { TwitterAction, TwitterActionSchemaAny } from "./actions/twitter_action";

export const TwitterAgentkitOptions = z
  .object({
    apiKey: z.string().optional().describe("The Twitter (X) API key"),
    apiSecret: z.string().optional().describe("The Twitter (X) API secret"),
    accessToken: z.string().optional().describe("The Twitter X() access token"),
    accessTokenSecret: z.string().optional().describe("The Twitter (X) access token secret"),
    bearerToken: z.string().optional().describe("The Twitter (X) bearer token"),
  })
  .strip()
  .describe("");

export class TwitterAgentkit {
  private client: TwitterApi;

  public constructor(options: z.infer<typeof TwitterAgentkitOptions>) {
    options.apiKey ||= process.env.TWITTER_API_KEY;
    options.apiSecret ||= process.env.TWITTER_API_SECRET;
    options.accessToken ||= process.env.TWITTER_ACCESS_TOKEN;
    options.accessTokenSecret || process.env.TWITTER_ACCESS_TOKEN_SECRET;
    options.bearerToken ||= process.env.TWITTER_BEARER_TOKEN;

    if (!this.validateOptions(options)) {
      throw new Error(
        "Twitter (X) Agentkit options require either bearer token, or all other credentials.",
      );
    }

    if (options.bearerToken) {
      this.client = new TwitterApi(options.bearerToken);
    } else {
      this.client = new TwitterApi({
        appKey: options.apiKey,
        appSecret: options.apiSecret,
        accessToken: options.accessToken,
        accessSecret: options.accessTokenSecret,
      } as TwitterApiTokens);
    }
  }

  validateOptions(options: z.infer<typeof TwitterAgentkitOptions>): boolean {
    if (options.bearerToken) {
      return true;
    }

    if (options.apiKey && options.apiSecret && options.accessToken && options.accessTokenSecret) {
      return true;
    }

    return false;
  }

  /**
   * Executes a Twitter (X) action
   *
   * @param {TwitterAction} the Twitter (X) action to execute
   * @param {TwitterActionSchemaAny} args for the action
   * @returns {Promise<string>} result of the execution
   */
  async run<TActionSchema extends TwitterActionSchemaAny>(
    action: TwitterAction<TActionSchema>,
    args: TActionSchema,
  ): Promise<string> {
    if (action.func.length > 1) {
      return await action.func(this.client, args);
    }

    return await (action.func as (args: z.infer<TActionSchema>) => Promise<string>)(args);
  }
}
