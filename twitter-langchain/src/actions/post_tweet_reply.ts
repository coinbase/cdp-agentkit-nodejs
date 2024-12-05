import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";

const POST_TWEET_REPLY_PROMPT = `
This tool will post a tweet on Twitter. The tool takes the text of the tweet as input. Tweets can be maximum 280 characters.

A successful response will return a message with the API response as a JSON payload:
    {"data": {"text": "hello, world!", "id": "0123456789012345678", "edit_history_tweet_ids": ["0123456789012345678"]}}

A failure response will return a message with the Twitter API request error:
    You are not allowed to create a Tweet with duplicate content.
`;

export const PostTweetReplyInput = z
  .object({
    tweetId: z.string().describe("The id of the tweet to reply to"),
    tweetReply: z
      .string()
      .max(280, "The reply to the tweet which must be a maximum of 280 characters."),
  })
  .strip()
  .describe("");

export async function postTweet(
  client: TwitterApi,
  args: z.infer<typeof PostTweetReplyInput>,
): Promise<string> {
  try {
    const response = await client.v2.tweet(args.tweetReply, {
      reply: { in_reply_to_tweet_id: args.tweetId },
    });

    return `Successfully posted reply to Twitter:\n${JSON.stringify(response)}`;
  } catch (error) {
    return `Error posting reply to Twitter: ${error}`;
  }
}

export class PostTweetReplyAction implements TwitterAction<typeof PostTweetReplyInput> {
  public name = "post_tweet_reply";
  public description = POST_TWEET_REPLY_PROMPT;
  public argsSchema = PostTweetReplyInput;
  public func = postTweet;
}
