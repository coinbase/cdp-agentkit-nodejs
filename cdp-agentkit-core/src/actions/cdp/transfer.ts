import { CdpAction } from "./cdp_action";
import { Wallet, Amount } from "@coinbase/coinbase-sdk";
import { z } from "zod";

const TRANSFER_PROMPT = `
This tool will transfer an asset from the wallet to another onchain address. It takes the amount, the asset ID to transfer, the destination to send the funds (either an onchain address, an ENS 'example.eth', or Basename 'example.base.eth'), and whether to do a gasless transfer as inputs. The gasless option is available on 'base-sepolia' and 'base-mainnet' networks for 'usdc' asset only. Always use the gasless option when it is available. Always use the asset ID 'usdc' when attempting to transfer USDC. Always ensure that you have enough balance of the input asset ID to complete the transfer.`;

/**
 * Input schema for transfer action.
 */
export const TransferInput = z
  .object({
    amount: z.custom<Amount>().describe("The amount of the asset to transfer"),
    assetId: z.string().describe("The asset ID to transfer"),
    destination: z.string().describe("The destination to transfer the funds"),
    gasless: z.boolean().default(false).describe("Whether to do a gasless transfer"),
  })
  .strip()
  .describe("Instructions for transferring assets");

/**
 * Transfers a specified amount of an asset to a destination onchain.
 *
 * @param wallet - The wallet to transfer the asset from.
 * @param args - The input arguments for the action.
 * @returns A message containing the transfer details.
 */
export async function transfer(
  wallet: Wallet,
  args: z.infer<typeof TransferInput>,
): Promise<string> {
  try {
    const transferResult = await wallet.createTransfer({
      amount: args.amount,
      assetId: args.assetId,
      destination: args.destination,
      gasless: args.gasless,
    });

    const result = await transferResult.wait();

    return `Transferred ${args.amount} of ${args.assetId} to ${args.destination}.\nTransaction hash for the transfer: ${result.getTransactionHash()}\nTransaction link for the transfer: ${result.getTransactionLink()}`;
  } catch (error) {
    return `Error transferring the asset: ${error}`;
  }
}

/**
 * Transfer action.
 */
export class TransferAction implements CdpAction<typeof TransferInput> {
  public name = "transfer";
  public description = TRANSFER_PROMPT;
  public argsSchema = TransferInput;
  public func = transfer;
}
