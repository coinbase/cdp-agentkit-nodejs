export const newContractInvocationFactory = () => {
  return {
    getContractInvocation: jest.fn(),
    listContractInvocations: jest.fn(),
    createContractInvocation: jest.fn(),
    broadcastContractInvocation: jest.fn(),
  };
};
