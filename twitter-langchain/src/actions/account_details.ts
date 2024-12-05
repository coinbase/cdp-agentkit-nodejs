import { z } from "zod";
import { TwitterAction } from "./twitter_action";
import { TwitterApi } from "twitter-api-v2";

const ACCOUNT_DETAILS_PROMPT = `
This tool will return account details for the currently authenticated Twitter (X) user context.

A successful response will return a message with the api response as a json payload:
    {"data": {"id": "1853889445319331840", "name": "CDP AgentKit", "username": "CDPAgentKit"}}

A failure response will return a message with a Twitter API request error:
    Error retrieving authenticated user account: 429 Too Many Requests
`;

export const AccountDetailsInput = z.object({}).strip().describe("");

export async function accountDetails(
  client: TwitterApi,
  _: z.infer<typeof AccountDetailsInput>,
): Promise<string> {
  try {
    const response = await client.v2.me();
    response.data.url = `https://x.com/${response.data.username}`;
    return `Successfully retrieved authenticated user account details:\n${JSON.stringify(response)}`;
  } catch (error) {
    return `Error retrieving authenticated user account details: ${error}`;
  }
}

export class AccountDetailsAction implements TwitterAction<typeof AccountDetailsInput> {
  public name = "account_details";
  public description = ACCOUNT_DETAILS_PROMPT;
  public argsSchema = AccountDetailsInput;
  public func = accountDetails;
}
