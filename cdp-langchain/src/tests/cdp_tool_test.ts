import { Wallet } from "@coinbase/coinbase-sdk";

import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";

import { CdpTool } from "../tools/cdp_tool";

import { z } from "zod";

describe("CdpTool", () => {
  let agentkit: CdpAgentkit;
  let mockWallet: jest.Mocked<Wallet>;

  beforeAll(async () => {
    mockWallet = {} as unknown as jest.Mocked<Wallet>;
    jest.spyOn(Wallet, "create").mockResolvedValue(mockWallet);
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
      expect(
        new CdpTool(
          {
            name: "test-tool",
            description: "test-tool-description",
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
          return `expected-return with property: ${input.property}`;
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
        const args = { property: "value" };
        const result = await tool.call(args);

        expect(result).toEqual(`expected-return with property: ${args.property}`);
      });

      it("should be successful with valid input", () => {
        const args = { property: "value" };
        expect(tool.call(args)).toBeDefined();
      });

      it("should fail with invalid input", () => {
        const args = {};
        expect(tool.call(args)).rejects.toThrow();
      });
    });
  });
});
