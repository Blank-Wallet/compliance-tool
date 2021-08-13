import TornadoConfig from './config';
const instances = TornadoConfig.deployments.netId1;

export enum KnownCurrencies {
    ETH = 'eth',
    DAI = 'dai',
    cDAI = 'cdai',
    USDC = 'usdc',
    USDT = 'usdt',
    WBTC = 'wbtc',
};

export type CurrencyAmountPair = {
    currency: KnownCurrencies;
    amount: string
};

export type ComplianceInfo = {
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
        nullifier: string;
    };
};

/**
 * Defines a type that types the currency with the available amount types
 */
 export type CurrencyAmountType = {
    [key in KnownCurrencies]: keyof typeof instances[key]['instanceAddress'];
  };

export enum AvailableNetworks {
    MAINNET = 'mainnet',
    GOERLI = 'goerli',
}

export const Networks: {[chainId: number]: string} = {
    1: 'mainnet',
    5: 'goerli'
}

type CurrencyAmountArrayType = {
    [ccy in KnownCurrencies]: CurrencyAmountType[ccy][];
  };
  /**
   * CurrencyAmountArray
   */
  export const CurrencyAmountArray: CurrencyAmountArrayType = Object.keys(
    instances,
  ).reduce((pv, cv) => {
    const currency = cv as KnownCurrencies;
    if (Object.values(KnownCurrencies).includes(currency)) {
      pv[currency] = Object.keys(
        instances[currency].instanceAddress,
      ).sort() as any[];
    }
    return pv;
  }, {} as CurrencyAmountArrayType);
  