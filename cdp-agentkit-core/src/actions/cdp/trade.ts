import { CdpAction } from "./cdp_action";
import { Wallet, Amount } from "@coinbase/coinbase-sdk";
import { z } from "zod";

const TRADE_PROMPT = `
This tool will trade a specified amount of a from asset to a to asset for the wallet. It takes the the amount of the from asset to trade, the from asset ID to trade, and the to asset ID to receive from the trade as inputs. Trades are only supported on Mainnets (e.g. 'base-mainnet', 'ethereum-mainnet'). Never allow trades on any other network.`;

/**
 * Input schema for trade action.
 */
export const TradeInput = z
  .object({
    amount: z.custom<Amount>().describe("The amount of the from asset to trade"),
    fromAssetId: z.string().describe("The from asset ID to trade"),
    toAssetId: z.string().describe("The to asset ID to receive from the trade"),
  })
  .strip()
  .describe("Instructions for trading assets");

/**
 * Trades a specified amount of a from asset to a to asset for the wallet.
 *
 * @param wallet - The wallet to trade the asset from.
 * @param args - The input arguments for the action.
 * @returns A message containing the trade details.
 */
export async function trade(wallet: Wallet, args: z.infer<typeof TradeInput>): Promise<string> {
  try {
    const tradeResult = await wallet.createTrade({
      amount: args.amount,
      fromAssetId: args.fromAssetId,
      toAssetId: args.toAssetId,
    });

    const result = await tradeResult.wait();

    return `Traded ${args.amount} of ${args.fromAssetId} for ${result.getToAmount()} of ${args.toAssetId}.\nTransaction hash for the trade: ${result.getTransaction().getTransactionHash()}\nTransaction link for the trade: ${result.getTransaction().getTransactionLink()}`;
  } catch (error) {
    return `Error trading assets: ${error}`;
  }
}

/**
 * Trade action.
 */
export class TradeAction implements CdpAction<typeof TradeInput> {
  public name = "trade";
  public description = TRADE_PROMPT;
  public argsSchema = TradeInput;
  public func = trade;
}
