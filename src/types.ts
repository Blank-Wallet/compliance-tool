import { BigNumber } from "ethers";
import TornadoConfig from "./config";
const instances = TornadoConfig.deployments.netId1;

export enum KnownCurrencies {
  ETH = "eth",
  DAI = "dai",
  cDAI = "cdai",
  USDC = "usdc",
  USDT = "usdt",
  WBTC = "wbtc",
}

export type CurrencyAmountPair = {
  currency: KnownCurrencies;
  amount: string;
};

export type ComplianceInfo = {
  chainId: number;
  deposit: {
    pair: CurrencyAmountPair;
    spent: boolean;
    timestamp: Date;
    commitment: string;
    transactionHash: string;
    from: string;
  };
  withdrawal: {
    pair: CurrencyAmountPair;
    to: string;
    transactionHash: string;
    timestamp: Date;
    fee: string;
    feeBN: BigNumber;
    nullifier: string;
  };
};

/**
 * getTokenDecimals
 * 
 * Obtains the decimal numbers of a pair token
 * 
 * @param chainId The note chainId 
 * @param pair The note pair
 * @returns The pair token decimals
 */
export const getTokenDecimals = (chainId: number, pair: CurrencyAmountPair): number => {
  if (!(chainId in Networks)) {
    throw new Error("Chain not supported");
  }

  return TornadoConfig.deployments[
    `netId${chainId}` as keyof typeof TornadoConfig.deployments
  ][pair.currency.toLowerCase() as KnownCurrencies].decimals;
};

/**
 * Defines a type that types the currency with the available amount types
 */
export type CurrencyAmountType = {
  [key in KnownCurrencies]: keyof typeof instances[key]["instanceAddress"];
};

export enum AvailableNetworks {
  MAINNET = "mainnet",
  GOERLI = "goerli",
}

export const Networks: { [chainId: number]: string } = {
  1: "mainnet",
  5: "goerli",
};

export const Endpoints: { [name in AvailableNetworks]: string } = {
  mainnet: "https://mainnet-node.blockwallet.io",
  goerli: "https://goerli-node.blockwallet.io",
};

type CurrencyAmountArrayType = {
  [ccy in KnownCurrencies]: CurrencyAmountType[ccy][];
};
/**
 * CurrencyAmountArray
 */
export const CurrencyAmountArray: CurrencyAmountArrayType = Object.keys(
  instances
).reduce((pv, cv) => {
  const currency = cv as KnownCurrencies;
  if (Object.values(KnownCurrencies).includes(currency)) {
    pv[currency] = Object.keys(
      instances[currency].instanceAddress
    ).sort() as any[];
  }
  return pv;
}, {} as CurrencyAmountArrayType);
