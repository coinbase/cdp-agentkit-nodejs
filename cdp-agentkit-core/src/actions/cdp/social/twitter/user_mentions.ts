/**
 * This module provides functionality to retrieve user mentions from Twitter (X).
 */

import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";

// TODO: ask John if this is okay, or if i should revert back to account_mentions vs user_mentions.

/**
 * Prompt message describing the user mentions tool.
 * A successful response will return a message with the API response in JSON format,
 * while a failure response will indicate an error from the Twitter API.
 */
const USER_MENTIONS_PROMPT = `
This tool will return mentions for the specified Twitter (X) user id.

A successful response will return a message with the API response as a JSON payload:
    {"data": [{"id": "1857479287504584856", "text": "@CDPAgentKit reply"}]}

A failure response will return a message with the Twitter API request error:
    Error retrieving user mentions: 429 Too Many Requests
`;

/**
 * Input argument schema for the user mentions action.
 */
export const UserMentionsInput = z
  .object({
    userId: z
      .string()
      .nonempty("User ID is required.")
      .describe("The Twitter (X) user id to return mentions for"),
  })
  .strip()
  .describe("Input schema for retrieving user mentions");

/**
 * Retrieves mentions for a specified Twitter (X) user.
 *
 * @param {TwitterApi} client - The Twitter (X) client used to authenticate with.
 * @param {z.infer<typeof UserMentionsInput>} args - The input arguments for the action.
 * @returns {Promise<string>} A message indicating the success or failure of the mention retrieval.
 */
export async function userMentions(
  client: TwitterApi,
  args: z.infer<typeof UserMentionsInput>,
): Promise<string> {
  try {
    const response = await client.v2.userMentionTimeline(args.userId);
    return `Successfully retrieved user mentions:\n${JSON.stringify(response)}`;
  } catch (error) {
    return `Error retrieving authenticated user mentions: ${error}`;
  }
}

/**
 * User Mentions Action
 */
export class UserMentionsAction implements TwitterAction<typeof UserMentionsInput> {
  public name = "user_mentions";
  public description = USER_MENTIONS_PROMPT;
  public argsSchema = UserMentionsInput;
  public func = userMentions;
}
