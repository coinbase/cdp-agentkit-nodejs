import {
  Coinbase,
  CreateERC20Options,
  CreateERC721Options,
  SmartContract,
  SmartContractType,
  Wallet,
} from "@coinbase/coinbase-sdk";

import { TransactionStatusEnum } from "../factories/smart_contract";

export const generateERC20SmartContract = (
  wallet: Wallet,
  options: CreateERC20Options,
): SmartContract => {
  return SmartContract.fromModel(generateERC20SmartContractData(wallet, options));
};

export const generateERC20SmartContractData = (wallet: Wallet, options: CreateERC20Options) => {
  return {
    smart_contract_id: "test-smart-contract-1",
    network_id: Coinbase.networks.BaseSepolia,
    wallet_id: wallet.getId()!,
    contract_address: "0xcontract-address",
    deployer_address: "0xdeployer-address",
    type: SmartContractType.ERC20,
    options: {
      name: options.name,
      symbol: options.symbol,
      total_supply: options.totalSupply.toString(),
    },
    abi: JSON.stringify("some-abi"),
    transaction: {
      network_id: Coinbase.networks.BaseSepolia,
      from_address_id: "0xdeadbeef",
      unsigned_payload:
        "7b2274797065223a22307832222c22636861696e4964223a2230783134613334222c226e6f6e6365223a22307830222c22746f223a22307861383261623835303466646562326461646161336234663037356539363762626533353036356239222c22676173223a22307865623338222c226761735072696365223a6e756c6c2c226d61785072696f72697479466565506572476173223a2230786634323430222c226d6178466565506572476173223a2230786634333638222c2276616c7565223a22307830222c22696e707574223a223078366136323738343230303030303030303030303030303030303030303030303034373564343164653761383132393862613236333138343939363830306362636161643733633062222c226163636573734c697374223a5b5d2c2276223a22307830222c2272223a22307830222c2273223a22307830222c2279506172697479223a22307830222c2268617368223a22307865333131636632303063643237326639313566656433323165663065376431653965353362393761346166623737336638653935646431343630653665326163227d",
      status: TransactionStatusEnum.Complete,
    },
  };
};

export const generateERC20SmartContractFromData = (data): SmartContract => {
  const typed = {
    ...data,
    type: SmartContractType.ERC20,
  };
  return SmartContract.fromModel(typed);
};

export const generateERC721SmartContract = (
  wallet: Wallet,
  options: CreateERC721Options,
): SmartContract => {
  return SmartContract.fromModel(generateERC721SmartContractData(wallet, options));
};

export const generateERC721SmartContractData = (wallet: Wallet, options: CreateERC721Options) => {
  return {
    smart_contract_id: "test-smart-contract",
    network_id: Coinbase.networks.BaseSepolia,
    wallet_id: wallet.getId()!,
    contract_address: "0xcontract-address",
    deployer_address: "0xdeployer-address",
    type: SmartContractType.ERC721,
    options: {
      base_uri: options.baseURI,
      name: options.name,
      symbol: options.symbol,
    },
    abi: JSON.stringify("test-abi"),
    transaction: {
      network_id: Coinbase.networks.BaseSepolia,
      from_address_id: "0xfrom-address-id",
      status: TransactionStatusEnum.Complete,
      unsigned_payload:
        "7b2274797065223a22307832222c22636861696e4964223a2230783134613334222c226e6f6e6365223a22307830222c22746f223a22307861383261623835303466646562326461646161336234663037356539363762626533353036356239222c22676173223a22307865623338222c226761735072696365223a6e756c6c2c226d61785072696f72697479466565506572476173223a2230786634323430222c226d6178466565506572476173223a2230786634333638222c2276616c7565223a22307830222c22696e707574223a223078366136323738343230303030303030303030303030303030303030303030303034373564343164653761383132393862613236333138343939363830306362636161643733633062222c226163636573734c697374223a5b5d2c2276223a22307830222c2272223a22307830222c2273223a22307830222c2279506172697479223a22307830222c2268617368223a22307865333131636632303063643237326639313566656433323165663065376431653965353362393761346166623737336638653935646431343630653665326163227d",
    },
  };
};

export const generateERC721SmartContractFromData = (data): SmartContract => {
  const typed = {
    ...data,
    type: SmartContractType.ERC721,
  };
  return SmartContract.fromModel(typed);
};