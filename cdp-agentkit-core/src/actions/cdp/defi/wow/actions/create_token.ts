import { CdpAction } from "../../../cdp_action";
import { Wallet } from "@coinbase/coinbase-sdk";
import { WOW_FACTORY_ABI, GENERIC_TOKEN_METADATA_URI, getFactoryAddress } from "../constants";
import { z } from "zod";

const WOW_CREATE_TOKEN_PROMPT = `
This tool will create a Zora Wow ERC20 memecoin using the WoW factory. This tool takes the token name, token symbol, and optionally a token URI containing metadata about the token. It uses a bonding curve so there is no need to add liquidity to the pool upfront. It is only supported on Base Sepolia and Base Mainnet.
`;

/**
 * Input schema for create token action.
 */
const WowCreateTokenInput = z
  .object({
    name: z.string().describe("The name of the token to create, e.g. WowCoin"),
    symbol: z.string().describe("The symbol of the token to create, e.g. WOW"),
    tokenUri: z
      .string()
      .optional()
      .describe(
        "The URI of the token metadata to store on IPFS, e.g. ipfs://QmY1GqprFYvojCcUEKgqHeDj9uhZD9jmYGrQTfA9vAE78J",
      ),
  })
  .strip()
  .describe("Instructions for creating a WOW token");

/**
 * Creates a Zora Wow ERC20 memecoin.
 *
 * @param wallet - The wallet to create the token from.
 * @param args - The input arguments for the action.
 * @returns A message containing the token creation details.
 */
async function wowCreateToken(
  wallet: Wallet,
  args: z.infer<typeof WowCreateTokenInput>,
): Promise<string> {
  const factoryAddress = getFactoryAddress(wallet.getNetworkId());

  try {
    const invocation = await wallet.invokeContract({
      contractAddress: factoryAddress,
      method: "deploy",
      abi: WOW_FACTORY_ABI,
      args: {
        _tokenCreator: (await wallet.getDefaultAddress()).getId(),
        _platformReferrer: "0x0000000000000000000000000000000000000000",
        _tokenURI: args.tokenUri || GENERIC_TOKEN_METADATA_URI,
        _name: args.name,
        _symbol: args.symbol,
      },
    });

    const result = await invocation.wait();
    return `Created WoW ERC20 memecoin ${args.name} with symbol ${args.symbol} on network ${wallet.getNetworkId()}.\nTransaction hash for the token creation: ${result.getTransaction().getTransactionHash()}`;
  } catch (error) {
    return `Error creating Zora Wow ERC20 memecoin ${error}`;
  }
}

/**
 * Zora Wow create token action.
 */
export class WowCreateTokenAction implements CdpAction<typeof WowCreateTokenInput> {
  public name = "wow_create_token";
  public description = WOW_CREATE_TOKEN_PROMPT;
  public argsSchema = WowCreateTokenInput;
  public func = wowCreateToken;
}
