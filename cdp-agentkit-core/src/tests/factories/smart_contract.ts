export const newSmartContractFactory = () => {
  return {
    createSmartContract: jest.fn(),
    deploySmartContract: jest.fn(),
    getSmartContract: jest.fn(),
    listSmartContracts: jest.fn(),
    readContract: jest.fn(),
  };
};
