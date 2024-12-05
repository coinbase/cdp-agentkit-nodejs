import { userMentions, UserMentionsInput } from "../actions/user_mentions";
import { TwitterApi, TwitterApiv2 } from "twitter-api-v2";

const MOCK_USER_ID = "1857479287504584856"

describe("User Mentions Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = { userId: "1857479287504584856" };
    const result = UserMentionsInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it("should fail to parse empty input", () => {
    const emptyInput = {};
    const result = UserMentionsInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe("Required");
  });

  it("should fail to parse invalid input", () => {
    const invalidInput = { userId: "" };
    const result = UserMentionsInput.safeParse(invalidInput);

    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toBe("User ID is required.");
  });
});

describe("User Mentions Action", () => {
  const mockApiResponse = {
    data: [
      {
        id: "0123456789012345678",
        text: "@CDPAgentkit please reply!",
      },
    ],
  };

  let mockApi: jest.Mocked<TwitterApi>;
  let mockClient: jest.Mocked<TwitterApiv2>;

  beforeEach(() => {
    mockClient = {
      userMentionTimeline: jest.fn().mockResolvedValue(mockApiResponse),
    } as unknown as jest.Mocked<TwitterApiv2>;

    mockApi = {
      get v2() {
        return mockClient;
      },
    } as unknown as jest.Mocked<TwitterApi>;
  });

  it("should successfully retrieve user mentions", async () => {
    const args = { userId: "1857479287504584856" };
    const response = await userMentions(mockApi, args);

    expect(mockClient.userMentionTimeline).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(response).toContain("Successfully retrieved user mentions:");
    expect(response).toContain(JSON.stringify(mockApiResponse));
  });

  it("should handle errors when retrieving user mentions", async () => {
    const args = {
      userId: MOCK_USER_ID,
    };

    const error = new Error("Twitter API error");
    mockClient.userMentionTimeline.mockRejectedValue(error);

    const response = await userMentions(mockApi, args);

    expect(mockApi.v2.userMentionTimeline).toHaveBeenCalledWith(MOCK_USER_ID);
    expect(response).toContain("Error retrieving authenticated user mentions:");
    expect(response).toContain(error.message);
  });
});
