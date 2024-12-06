import { TwitterToolkit } from "../twitter_toolkit";
import { TwitterTool } from "../twitter_tool";
import {
  TwitterAction,
  TwitterActionSchemaAny,
  TwitterAgentkit,
} from "@coinbase/cdp-agentkit-core";
import { z } from "zod";

describe("TwitterToolkit", () => {
  let mockAgentkit: jest.Mocked<TwitterAgentkit>;
  let mockActions: jest.Mocked<TwitterAction<TwitterActionSchemaAny>>[];
  let twitterToolkit: TwitterToolkit;

  beforeEach(() => {
    mockAgentkit = {
      run: jest.fn((action, args) => action.func(mockAgentkit, args)),
    } as unknown as jest.Mocked<TwitterAgentkit>;

    mockActions = [
      {
        name: "test_action_1",
        description: "Test Twitter Action 1",
        argsSchema: z.object({ param1: z.string() }),
        func: jest.fn().mockResolvedValue("success_1"),
      },
      {
        name: "test_action_2",
        description: "Test Twitter Action 2",
        argsSchema: z.object({ param2: z.string() }),
        func: jest.fn().mockResolvedValue("success_2"),
      },
    ];

    twitterToolkit = new TwitterToolkit(mockAgentkit);
    twitterToolkit.tools = mockActions.map(action => new TwitterTool(action, mockAgentkit));
  });

  it("should initialize with correct tools", () => {
    expect(twitterToolkit.tools).toHaveLength(mockActions.length);
    expect(twitterToolkit.tools[0].name).toBe("test_action_1");
    expect(twitterToolkit.tools[1].name).toBe("test_action_2");
  });

  it("should execute action from toolkit", async () => {
    const tool = twitterToolkit.tools[0];
    const args = { param1: "test" };
    const response = await tool.call(args);

    expect(mockActions[0].func).toHaveBeenCalledWith(mockAgentkit, args);
    expect(response).toBe("success_1");
  });

  it("should handle action execution failure", async () => {
    const error = new Error("Execution failed");
    mockActions[0].func.mockRejectedValue(error);

    const tool = twitterToolkit.tools[0];
    const args = { param1: "test" };
    const response = await tool.call(args);

    expect(response).toContain(`Error executing test_action_1: ${error.message}`);
  });

  it("should return all available tools", () => {
    const tools = twitterToolkit.getTools();

    expect(tools).toHaveLength(mockActions.length);
    expect(tools[0].name).toBe("test_action_1");
    expect(tools[1].name).toBe("test_action_2");
  });
});
