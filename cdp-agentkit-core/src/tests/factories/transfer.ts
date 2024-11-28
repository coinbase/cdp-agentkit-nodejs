export const newTransferFactory = () => {
  return {
    broadcastTransfer: jest.fn(),
    createTransfer: jest.fn(),
    getTransfer: jest.fn(),
    listTransfers: jest.fn(),
  };
};
