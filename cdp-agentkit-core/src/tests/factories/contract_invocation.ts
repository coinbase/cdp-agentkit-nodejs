import { SmartContract } from "@coinbase/coinbase-sdk";
import { TransactionData } from "./smart_contract";
import { mockFn } from "../utils/mock";

export interface ContractInvocation {
  network_id: string;
  wallet_id: string;
  address_id: string;
  contract_invocation_id: string;
  contract_address: string;
  method: string;
  args: string;
  abi?: string;
  amount: string;
  transaction: TransactionData;
}

// export const newContractInvocationFactory = (data: ContractInvocation) => {
export const newContractInvocationFactory = () => {
  // const getContractInvocationFn = mockFn(_ => {
  //   return { data: data };
  // });

  // const createContractInvocationFn = mockFn(request => {
  //   return { data: data };
  // });

  return {
    getContractInvocation: jest.fn(),
    listContractInvocations: jest.fn(),
    createContractInvocation: jest.fn(),
    broadcastContractInvocation: jest.fn(),
  };
};
