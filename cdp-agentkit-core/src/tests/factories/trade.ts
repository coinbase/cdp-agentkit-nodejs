export const newTradeFactory = () => {
  return {
    getTrade: jest.fn(),
    listTrades: jest.fn(),
    createTrade: jest.fn(),
    broadcastTrade: jest.fn(),
  };
};
