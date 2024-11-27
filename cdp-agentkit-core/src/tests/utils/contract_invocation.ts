import {
  ContractInvocation,
  CreateContractInvocationOptions,
  Wallet,
} from "@coinbase/coinbase-sdk";
import { TransactionStatusEnum } from "../factories/smart_contract";

export const generateContractInvocation = (
  wallet: Wallet,
  options: CreateContractInvocationOptions,
): ContractInvocation => {
  return ContractInvocation.fromModel(generateContractInvocationData(wallet, options));
};

export const generateContractInvocationData = (
  wallet: Wallet,
  options: CreateContractInvocationOptions,
) => {
  return {
    wallet_id: wallet.getId()!,
    address_id: options.contractAddress,
    contract_invocation_id: "test-contract-invocation",
    network_id: wallet.getNetworkId(),
    contract_address: "0xcontract-address",
    method: "mint",
    args: JSON.stringify(options.args),
    abi: JSON.stringify(options.abi),
    amount: "0",
    transaction: {
      network_id: wallet.getNetworkId(),
      from_address_id: "0xdeadbeef",
      unsigned_payload:
        "7b2274797065223a22307832222c22636861696e4964223a2230783134613334222c226e6f6e6365223a22307830222c22746f223a22307861383261623835303466646562326461646161336234663037356539363762626533353036356239222c22676173223a22307865623338222c226761735072696365223a6e756c6c2c226d61785072696f72697479466565506572476173223a2230786634323430222c226d6178466565506572476173223a2230786634333638222c2276616c7565223a22307830222c22696e707574223a223078366136323738343230303030303030303030303030303030303030303030303034373564343164653761383132393862613236333138343939363830306362636161643733633062222c226163636573734c697374223a5b5d2c2276223a22307830222c2272223a22307830222c2273223a22307830222c2279506172697479223a22307830222c2268617368223a22307865333131636632303063643237326639313566656433323165663065376431653965353362393761346166623737336638653935646431343630653665326163227d",
      status: TransactionStatusEnum.Complete,
    },
  };
};

export const generateContractInvocationFromData = (data): ContractInvocation => {
  return ContractInvocation.fromModel(data);
};

export const generateContractInvocationSigned = (
  wallet: Wallet,
  options: CreateContractInvocationOptions,
) => {
  return ContractInvocation.fromModel(generateContractInvocationData(wallet, options));
};

export const generateContractInvocationSignedData = (
  wallet: Wallet,
  options: CreateContractInvocationOptions,
) => {
  const templateData = generateContractInvocationData(wallet, options);

  return {
    ...templateData,
    transaction: {
      ...templateData.transaction,
      signed_payload:
        "02f88f83014a3480830f4240830f436882eb3894a82ab8504fdeb2dadaa3b4f075e967bbe35065b980a46a627842000000000000000000000000475d41de7a81298ba263184996800cbcaad73c0bc080a00bca053345d88d7cc02c257c5d74f8285bc6408c9020e1b4331779995f355c0ca04a8ec5bee1609d97f3ccba1e0d535441cf61c708e9bc632fe9963b34f97d0462",
      status: TransactionStatusEnum.Broadcast,
      transaction_hash: "0xdummy-transaction-hash",
      transaction_link: "https://sepolia.basescan.org/tx/0xdummy-transaction-hash",
    },
  };
};
