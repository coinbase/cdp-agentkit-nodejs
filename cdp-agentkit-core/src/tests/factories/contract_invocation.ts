import { SmartContract } from "@coinbase/coinbase-sdk";
import { TransactionData } from "./smart_contract";
import { mockFn } from "../utils/mock";

export const newContractInvocationFactory = () => {
  return {
    getContractInvocation: jest.fn(),
    listContractInvocations: jest.fn(),
    createContractInvocation: jest.fn(),
    broadcastContractInvocation: jest.fn(),
  };
};
