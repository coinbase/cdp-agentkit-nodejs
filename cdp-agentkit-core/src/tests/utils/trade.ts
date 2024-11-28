import { CreateTradeOptions, Trade, Wallet } from "@coinbase/coinbase-sdk";
import { TransactionStatusEnum } from "../factories/smart_contract";

const PAYLOAD_SIGNED =
  "02f87683014a34808459682f008459682f00825208944d9e4f3f4d1a8b5f4f7b1f5b5c7b8d6b2b3b1b0b89056bc75e2d6310000080c001a07ae1f4655628ac1b226d60a6243aed786a2d36241ffc0f306159674755f4bd9ca050cd207fdfa6944e2b165775e2ca625b474d1eb40fda0f03f4ca9e286eae3cbe";

const PAYLOAD_UNSIGNED =
  "7b2274797065223a22307832222c22636861696e4964223a2230783134613334222c226e6f6e63 65223a22307830222c22746f223a22307834643965346633663464316138623566346637623166 356235633762386436623262336231623062222c22676173223a22307835323038222c22676173 5072696365223a6e756c6c2c226d61785072696f72697479466565506572476173223a223078 3539363832663030222c226d6178466565506572476173223a2230783539363832663030222c22 76616c7565223a2230783536626337356532643633313030303030222c22696e707574223a22 3078222c226163636573734c697374223a5b5d2c2276223a22307830222c2272223a2230783022 2c2273223a22307830222c2279506172697479223a22307830222c2268617368223a2230783664 633334306534643663323633653363396561396135656438646561346332383966613861363966 3031653635393462333732386230386138323335333433227d";

export interface GenerateTradeDataOptions extends CreateTradeOptions {
  addressId: string;
  fromAmount: number;
  toAmount: number;
}

export const generateTrade = (wallet: Wallet, options: GenerateTradeDataOptions): Trade => {
  return new Trade(generateTradeData(wallet, options));
};

export const generateTradeData = (wallet: Wallet, options: GenerateTradeDataOptions) => {
  return {
    network_id: wallet.getNetworkId(),
    wallet_id: wallet.getId()!,
    address_id: options.fromAssetId,
    from_asset: {
      network_id: wallet.getNetworkId(),
      asset_id: "eth",
      decimals: 18,
    },
    to_asset: {
      network_id: wallet.getNetworkId(),
      asset_id: options.toAssetId,
      decimals: 6,
    },
    from_amount: options.fromAmount.toString(),
    to_amount: options.toAmount.toString(),
    trade_id: crypto.randomUUID(),
    transaction: {
      network_id: wallet.getNetworkId(),
      status: TransactionStatusEnum.Complete,
      from_address_id: options.addressId,
      unsigned_payload: PAYLOAD_UNSIGNED,
    },
    approve_transaction: {
      network_id: wallet.getNetworkId(),
      status: TransactionStatusEnum.Complete,
      from_address_id: options.addressId,
      unsigned_payload: PAYLOAD_UNSIGNED,
      signed_payload: PAYLOAD_SIGNED,
    },
  };
};

export const generateTradeFromData = (data): Trade => {
  return new Trade(data);
};
