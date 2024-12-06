import { TwitterAction, TwitterActionSchemaAny } from "./twitter_action";
import { AccountDetailsAction } from "./account_details";
import { PostTweetAction } from "./post_tweet";
import { PostTweetReplyAction } from "./post_tweet_reply";
import { UserMentionsAction } from "./user_mentions";

/**
 * @returns - Array of Twitter (X) action instances
 */
export function getAllTwitterActions(): TwitterAction<TwitterActionSchemaAny>[] {
  return [
    new AccountDetailsAction(),
    new PostTweetReplyAction(),
    new PostTweetAction(),
    new UserMentionsAction(),
  ];
}

export const TWITTER_ACTIONS = getAllTwitterActions();

export {
  TwitterAction,
  AccountDetailsAction,
  PostTweetAction,
  PostTweetReplyAction,
  UserMentionsAction,
};
