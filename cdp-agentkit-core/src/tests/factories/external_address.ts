export const newExternalAddressFactory = () => {
  return {
    listExternalAddressBalances: jest.fn(),
    getExternalAddressBalance: jest.fn(),
    requestExternalFaucetFunds: jest.fn(),
    listAddressTransactions: jest.fn(),
    getFaucetTransaction: jest.fn(),
  };
};
