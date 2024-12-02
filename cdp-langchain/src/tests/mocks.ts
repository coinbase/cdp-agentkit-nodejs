export const mockFn = (...args) => jest.fn(...args) as any;
export const mockReturnRejectedValue = data => jest.fn().mockRejectedValue(data);
export const mockReturnValue = data => jest.fn().mockResolvedValue({ data });

//
// Wallet
//

export interface WalletData {
  id: string;
  address: WalletAddressData;
  networkId: string;
  privateKey: string;
}

export const newWalletMock = (data: WalletData) => {
  const createWalletFn = mockFn(request => {
    const response = {
      id: data.id,
      network_id: data.networkId,
      default_address: data.address,
    };

    return { data: response };
  });

  const getWalletFn = mockFn(walletId => {
    const response = {
      id: data.id,
      network_id: data.networkId,
      default_address: data.address,
    };

    return { data: response };
  });

  return {
    createWallet: createWalletFn,
    deployNFT: jest.fn(),
    getWallet: getWalletFn,
    getWalletBalance: jest.fn(),
    listWallets: jest.fn(),
    listWalletBalances: jest.fn(),
  };
};

//
// Wallet Address
//

export interface WalletAddressData {
  address_id: string;
  index: number;
  network_id: string;
  private_key: string;
  public_key: string;
  wallet_id: string;
}

export const newWalletAddressMock = (data: WalletAddressData[]) => {
  const index = data.reduce((container, item) => {
    container[item.wallet_id] = item;
    return container;
  }, {});

  // const index = data.reduce((container, item) => {
  //   container[item.walletId] ||= [];
  //   container[item.walletId].push(item);
  //   return container;
  // }, {});

  // Object.keys(index).forEach(key => {
  //   index[key].sort((a, b) => a.index - b.index);
  // });

  const createAddressFn = mockFn(walletId => {
    const address = index[walletId]; //[0];
    const response = {
      ...address,
      wallet_id: walletId,
    };

    return { data: response };
  });

  return {
    createAddress: createAddressFn,
    createPayloadSignature: jest.fn(),
    getAddress: jest.fn(),
    getAddressBalance: jest.fn(),
    getPayloadSignature: jest.fn(),
    listAddresses: jest.fn(),
    listAddressBalances: jest.fn(),
    listPayloadSignatures: jest.fn(),
    requestFaucetFunds: jest.fn(),
  };
};
