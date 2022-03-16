import { BigNumber } from "ethers";
import TornadoConfig from "./config";

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
export const getTornadoTokenDecimals = (
  chainId: number,
  pair: CurrencyAmountPair
): number => {
  const currencies = TornadoConfig.deployments[
    `netId${chainId}` as keyof typeof TornadoConfig.deployments
  ].currencies as unknown as { [c in KnownCurrencies]: { decimals: number } };
  return currencies[pair.currency.toLowerCase() as KnownCurrencies].decimals;
};

/**
 * List of known supported networks
 */
export enum AvailableNetworks {
  MAINNET = "mainnet",
  GOERLI = "goerli",
  POLYGON = "polygon",
  BSC = "bsc",
  xDAI = "xdai",
  ARBITRUM = "arbitrum",
  AVALANCHEC = "avalanchec",
  OPTIMISM = "optimism",
}

/**
 * List of known supported currencies
 */
export enum KnownCurrencies {
  ETH = "eth",
  DAI = "dai",
  cDAI = "cdai",
  USDC = "usdc",
  USDT = "usdt",
  WBTC = "wbtc",
  MATIC = "matic",
  BNB = "bnb",
  xDAI = "xdai",
  AVAX = "avax",
}

/**
 * List of known native supported currencies
 */
export type NativeKnownCurrencies =
  | KnownCurrencies.ETH
  | KnownCurrencies.MATIC
  | KnownCurrencies.AVAX
  | KnownCurrencies.xDAI
  | KnownCurrencies.BNB;

/**
 * List of known ERC20 supported currencies
 */
export type ERC20KnownCurrencies = Exclude<
  KnownCurrencies,
  NativeKnownCurrencies
>;

export const Networks: { [chainId: number]: string } = {
  1: "mainnet",
  5: "goerli",
  56: "bsc",
  137: "polygon",
  42161: "arbitrum",
  10: "optimism",
  43114: "avalanchec",
  100: "xdai",
};

export const Endpoints: { [name in AvailableNetworks]: string } = {
  mainnet: "https://mainnet-node.blockwallet.io",
  goerli: "https://goerli-node.blockwallet.io",
  bsc: "https://bsc-node.blockwallet.io",
  polygon: `https://polygon-node.blockwallet.io`,
  arbitrum: "https://arbitrum-node.blockwallet.io",
  optimism: "https://optimism-node.blockwallet.io",
  avalanchec: `https://avax-node.blockwallet.io`,
  xdai: "https://rpc.gnosischain.com/",
};

/**
 * Defines a type that associates each available currency with their respective amount types
 */
export type CurrencyAmountType = {
  eth: "0.1" | "1" | "10" | "100";
  dai: "100" | "1000" | "10000" | "100000";
  cdai: "5000" | "50000" | "500000" | "5000000";
  usdc: "100" | "1000";
  usdt: "100" | "1000";
  wbtc: "0.1" | "1" | "10";
  matic: "100" | "1000" | "10000" | "100000";
  bnb: "0.1" | "1" | "10" | "100";
  avax: "10" | "100" | "500";
  xdai: "100" | "1000" | "10000" | "100000";
};

export const CurrencyAmountArray: {
  [ccy in KnownCurrencies]: CurrencyAmountType[ccy][];
} = {
  eth: ["0.1", "1", "10", "100"],
  dai: ["100", "1000", "10000", "100000"],
  cdai: ["5000", "50000", "500000", "5000000"],
  usdc: ["100", "1000"],
  usdt: ["100", "1000"],
  wbtc: ["0.1", "1", "10"],
  matic: ["100", "1000", "10000", "100000"],
  bnb: ["0.1", "1", "10", "100"],
  avax: ["10", "100", "500"],
  xdai: ["100", "1000", "10000", "100000"],
};

export type CurrencyAmountArrayType = typeof CurrencyAmountArray;
