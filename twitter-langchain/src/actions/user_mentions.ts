import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";

// TODO: ask John if this is okay, or if i should revert back to account_mentions vs user_mentions.

const USER_MENTIONS_PROMPT = `
This tool will return mentions for the specified Twitter (X) user id.

A successful response will return a message with the API response as a JSON payload:
    {"data": [{"id": "1857479287504584856", "text": "@CDPAgentKit reply"}]}

A failure response will return a message with the Twitter API request error:
    Error retrieving user mentions: 429 Too Many Requests
`;

export const UserMentionsInput = z
  .object({
    userId: z
      .string()
      .nonempty("User ID is required.")
      .describe("The Twitter (X) user id to return mentions for"),
  })
  .strip()
  .describe("");

export async function userMentions(
  client: TwitterApi,
  args: z.infer<typeof UserMentionsInput>,
): Promise<string> {
  try {
    const response = await client.v2.userMentionTimeline(args.userId);
    return `Successfully retrieved user user mentions:\n${JSON.stringify(response)}`;
  } catch (error) {
    return `Error retrieving authenticated user user mentions: ${error}`;
  }
}

export class UserMentionsAction implements TwitterAction<typeof UserMentionsInput> {
  public name = "user_mentions";
  public description = USER_MENTIONS_PROMPT;
  public argsSchema = UserMentionsInput;
  public func = userMentions;
}
