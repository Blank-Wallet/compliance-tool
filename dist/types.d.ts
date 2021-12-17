import { BigNumber } from "ethers";
declare const instances: {
    eth: {
        instanceAddress: {
            "0.1": string;
            "1": string;
            "10": string;
            "100": string;
        };
        symbol: string;
        decimals: number;
    };
    dai: {
        instanceAddress: {
            "100": string;
            "1000": string;
            "10000": string;
            "100000": string;
        };
        tokenAddress: string;
        symbol: string;
        decimals: number;
    };
    cdai: {
        instanceAddress: {
            "5000": string;
            "50000": string;
            "500000": string;
            "5000000": string;
        };
        tokenAddress: string;
        symbol: string;
        decimals: number;
    };
    usdc: {
        instanceAddress: {
            "100": string;
            "1000": string;
        };
        tokenAddress: string;
        symbol: string;
        decimals: number;
    };
    usdt: {
        instanceAddress: {
            "100": string;
            "1000": string;
        };
        tokenAddress: string;
        symbol: string;
        decimals: number;
    };
    wbtc: {
        instanceAddress: {
            "0.1": string;
            "1": string;
            "10": string;
        };
        tokenAddress: string;
        symbol: string;
        decimals: number;
    };
    proxy: string;
    defaultProxy: string;
};
export declare enum KnownCurrencies {
    ETH = "eth",
    DAI = "dai",
    cDAI = "cdai",
    USDC = "usdc",
    USDT = "usdt",
    WBTC = "wbtc"
}
export declare type CurrencyAmountPair = {
    currency: KnownCurrencies;
    amount: string;
};
export declare type ComplianceInfo = {
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
export declare const getTokenDecimals: (chainId: number, pair: CurrencyAmountPair) => number;
/**
 * Defines a type that types the currency with the available amount types
 */
export declare type CurrencyAmountType = {
    [key in KnownCurrencies]: keyof typeof instances[key]["instanceAddress"];
};
export declare enum AvailableNetworks {
    MAINNET = "mainnet",
    GOERLI = "goerli"
}
export declare const Networks: {
    [chainId: number]: string;
};
export declare const Endpoints: {
    [name in AvailableNetworks]: string;
};
declare type CurrencyAmountArrayType = {
    [ccy in KnownCurrencies]: CurrencyAmountType[ccy][];
};
/**
 * CurrencyAmountArray
 */
export declare const CurrencyAmountArray: CurrencyAmountArrayType;
export {};
