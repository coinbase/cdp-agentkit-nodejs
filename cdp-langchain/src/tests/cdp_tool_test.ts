import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";

import { CdpTool } from "../tools/cdp_tool";

import { z } from "zod";

describe("CdpTool", () => {
  let agentkit: CdpAgentkit;
  let mockWallet: jest.Mocked<Wallet>;

  beforeAll(async () => {
    mockWallet = {} as unknown as jest.Mocked<Wallet>;
  });

  describe("initialization", () => {
    beforeEach(async () => {
      const options = {
        cdpApiKeyName: "test-key",
        cdpApiKeyPrivateKey: "test-private-key",
        wallet: mockWallet,
      };

      agentkit = await CdpAgentkit.configureWithWallet(options);
    });

    it("should be successful", async () => {
      const tool = expect(
        new CdpTool(
          {
            name: "",
            description: "",
            argsSchema: z.object({}),
            func: jest.fn().mockReturnValue({}),
          },
          agentkit,
        ),
      ).toBeDefined();
    });

    describe("call", () => {
      let inputSchema;
      let tool;

      beforeAll(() => {
        inputSchema = z
          .object({
            property: z.string().describe("a property for input"),
          })
          .strip()
          .describe("mock tool input");

        const toolFn = async (input: z.infer<typeof inputSchema>) => {
          return "expected-return";
        };

        tool = new CdpTool(
          {
            name: "test-tool",
            description: "test-tool-description",
            argsSchema: inputSchema,
            func: toolFn,
          },
          agentkit,
        );
      });

      it("should be successful", async () => {
        const input = { property: "value" };
        const result = await tool.call(input);

        expect(result).toEqual("expected-return");
      });

      it("should be successful with valid input", () => {
        const input = { property: "value" };
        expect(tool.call(input)).toBeDefined();
      });

      it("should fail", async () => {
        const toolErr = new Error("An error has occured");
        const toolFn = jest.fn().mockRejectedValue(toolErr);
        const tool = new CdpTool(
          {
            name: "test-tool",
            description: "test-tool-description",
            argsSchema: inputSchema,
            func: toolFn,
          },
          agentkit,
        );

        const input = { property: "value" };
        const result = await tool.call(input);
        const expected = `Error executing ${tool.name}: ${toolErr.message}`;

        expect(result).toEqual(expected);
      });

      it("should fail with invalid input", () => {
        const input = {};
        expect(tool.call(input)).rejects.toThrow();
      });
    });
  });
});
