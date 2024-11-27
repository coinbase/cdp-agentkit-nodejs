export interface TransactionData {
  network_id: string;
  block_hash?: string;
  block_height?: string;
  from_address_id: string;
  to_address_id?: string;
  unsigned_payload: string;
  signed_payload?: string;
  transaction_hash?: string;
  transaction_link?: string;
  status: TransactionStatusEnum;
  // content?: TransactionContent;
}

export const TransactionStatusEnum = {
  Pending: "pending",
  Signed: "signed",
  Broadcast: "broadcast",
  Complete: "complete",
  Failed: "failed",
  Unspecified: "unspecified",
} as const;

export type TransactionStatusEnum =
  (typeof TransactionStatusEnum)[keyof typeof TransactionStatusEnum];

export const newSmartContractFactory = () => {
  return {
    createSmartContract: jest.fn(),
    deploySmartContract: jest.fn(),
    getSmartContract: jest.fn(),
    listSmartContracts: jest.fn(),
    readContract: jest.fn(),
  };
};
