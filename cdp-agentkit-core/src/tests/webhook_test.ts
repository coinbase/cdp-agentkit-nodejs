import { Webhook, Wallet } from "@coinbase/coinbase-sdk";

import { createWebhook, CreateWebhookInput } from "../actions/cdp/webhooks";
import { z } from "zod";

const MOCK_NETWORK = "base-sepolia";
const MOCK_URL = "https://example.com/";
const MOCK_ADDRESS = "0x321";
const MOCK_EVENTY_TYPE = "wallet_activity";

describe("Webhook Input", () => {
  it("should successfully parse valid input", () => {
    const validInput = {
      notificationUri: MOCK_URL,
      eventType: MOCK_EVENTY_TYPE,
      eventTypeFilter: {
        addresses: [MOCK_ADDRESS],
      },
      networkId: MOCK_NETWORK,
    };

    const result = CreateWebhookInput.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);

    const anotherValidInput = {
      notificationUri: MOCK_URL,
      eventType: "erc721_transfer",
      eventTypeFilter: {
        addresses: [MOCK_ADDRESS],
      },
      eventFilters: [
        {
          from_address: MOCK_ADDRESS,
        },
      ],
      networkId: MOCK_NETWORK,
    };

    const result2 = CreateWebhookInput.safeParse(anotherValidInput);

    expect(result2.success).toBe(true);
    expect(result2.data).toEqual(anotherValidInput);
  });

  it("should fail parsing empty input", () => {
    const emptyInput = {};
    const result = CreateWebhookInput.safeParse(emptyInput);

    expect(result.success).toBe(false);
  });
});

describe("Create webhook action", () => {
  let mockWebhook: jest.Mocked<Webhook>;
  let mockWallet: jest.Mocked<Wallet>;
  let mockStaticCreate;
  let mockStaticCreateError;
  const errorMsg = "Failed to create webhook";

  beforeEach(async () => {
    mockStaticCreate = jest.fn().mockResolvedValue(mockWebhook);
    mockStaticCreateError = jest.fn().mockRejectedValue(new Error(errorMsg));
    Webhook.create = mockStaticCreate;
    mockWebhook = {
      // create: jest.fn().mockReturnValue(mockWebhook),
    } as unknown as jest.Mocked<Webhook>;

    mockWallet = {
      createTransfer: jest.fn(),
    } as unknown as jest.Mocked<Wallet>;

    // mockWallet.createTransfer.mockResolvedValue(mockWebhook);
  });

  it("should successfully create wallet activity webhook", async () => {
    const args = {
      notificationUri: MOCK_URL,
      eventType: MOCK_EVENTY_TYPE,
      eventTypeFilter: {
        addresses: [MOCK_ADDRESS],
      },
      networkId: MOCK_NETWORK,
    };
    const response = await createWebhook(mockWallet, args as z.infer<typeof CreateWebhookInput>);

    const expectedResponse = {
      ...args,
      eventTypeFilter: {
        ...args.eventTypeFilter,
        wallet_id: "",
      },
    };
    expect(Webhook.create).toHaveBeenCalledWith(expectedResponse);
    expect(response).toContain(`The webhook was successfully created:`);
  });

  it("should successfully create smart contract activity webhook", async () => {
    const args = {
      notificationUri: MOCK_URL,
      eventType: "smart_contract_event_activity",
      eventTypeFilter: {
        addresses: [MOCK_ADDRESS],
      },
      networkId: MOCK_NETWORK,
    };
    const response = await createWebhook(mockWallet, args as z.infer<typeof CreateWebhookInput>);

    const expectedResponse = {
      ...args,
      eventTypeFilter: {
        contract_addresses: args.eventTypeFilter.addresses,
      },
    };
    expect(Webhook.create).toHaveBeenCalledWith(expectedResponse);
    expect(response).toContain(`The webhook was successfully created:`);
  });

  it("should successfully create erc20_transfer webhook", async () => {
    const args = {
      notificationUri: MOCK_URL,
      eventType: "erc20_transfer",
      eventTypeFilter: {
        addresses: [MOCK_ADDRESS],
      },
      eventFilters: [
        {
          from_address: MOCK_ADDRESS,
        },
      ],
      networkId: MOCK_NETWORK,
    };
    const response = await createWebhook(mockWallet, args as z.infer<typeof CreateWebhookInput>);

    const expectedResponse = {
      notificationUri: args.notificationUri,
      eventType: args.eventType,
      eventFilters: args.eventFilters,
      networkId: args.networkId,
    };
    expect(Webhook.create).toHaveBeenCalledWith(expectedResponse);
    expect(response).toContain(`The webhook was successfully created:`);
  });

  it("should successfully create erc721_transfer webhook", async () => {
    const args = {
      notificationUri: MOCK_URL,
      eventType: "erc721_transfer",
      eventTypeFilter: {
        addresses: [MOCK_ADDRESS],
      },
      eventFilters: [
        {
          from_address: MOCK_ADDRESS,
        },
      ],
      networkId: MOCK_NETWORK,
    };
    const response = await createWebhook(mockWallet, args as z.infer<typeof CreateWebhookInput>);

    const expectedResponse = {
      notificationUri: args.notificationUri,
      eventType: args.eventType,
      eventFilters: args.eventFilters,
      networkId: args.networkId,
    };
    expect(Webhook.create).toHaveBeenCalledWith(expectedResponse);
    expect(response).toContain(`The webhook was successfully created:`);
  });

  it("should fail with an error", async () => {
    const args = {
      notificationUri: MOCK_URL,
      eventType: MOCK_EVENTY_TYPE,
      eventTypeFilter: {
        addresses: ["test"],
      },
      networkId: MOCK_NETWORK,
    };

    Webhook.create = mockStaticCreateError;

    const response = await createWebhook(mockWallet, args as z.infer<typeof CreateWebhookInput>);

    const expectedResponse = {
      ...args,
      eventTypeFilter: {
        ...args.eventTypeFilter,
        wallet_id: "",
      },
    };
    expect(Webhook.create).toHaveBeenCalledWith(expectedResponse);
    expect(response).toContain(`Error: ${errorMsg}`);
  });
});
