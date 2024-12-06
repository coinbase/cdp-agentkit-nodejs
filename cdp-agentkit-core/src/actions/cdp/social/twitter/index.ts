/**
 * This module exports various Twitter (X) action instances and their associated types.
 */

import { TwitterAction, TwitterActionSchemaAny } from "./twitter_action";
import { AccountDetailsAction } from "./account_details";
import { PostTweetAction } from "./post_tweet";
import { PostTweetReplyAction } from "./post_tweet_reply";
import { UserMentionsAction } from "./user_mentions";

/**
 * Retrieve an array of Twitter (X) action instances.
 *
 * @returns {TwitterAction<TwitterActionSchemaAny>[]} An array of Twitter action instances.
 */
export function getAllTwitterActions(): TwitterAction<TwitterActionSchemaAny>[] {
  return [
    new AccountDetailsAction(),
    new PostTweetReplyAction(),
    new PostTweetAction(),
    new UserMentionsAction(),
  ];
}

/**
 * All available Twitter (X) actions.
 */
export const TWITTER_ACTIONS = getAllTwitterActions();

/**
 * All Twitter (X) action types.
 */
export {
  TwitterAction,
  TwitterActionSchemaAny,
  AccountDetailsAction,
  PostTweetAction,
  PostTweetReplyAction,
  UserMentionsAction,
};
