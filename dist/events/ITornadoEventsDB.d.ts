import { BigNumber } from "@ethersproject/bignumber";
import { DBSchema } from "idb";
import { AvailableNetworks, CurrencyAmountType, KnownCurrencies } from "../types";
export declare type CurrenciesKeys = `${KnownCurrencies.ETH}-${CurrencyAmountType[KnownCurrencies.ETH]}` | `${KnownCurrencies.DAI}-${CurrencyAmountType[KnownCurrencies.DAI]}` | `${KnownCurrencies.cDAI}-${CurrencyAmountType[KnownCurrencies.cDAI]}` | `${KnownCurrencies.USDT}-${CurrencyAmountType[KnownCurrencies.USDT]}` | `${KnownCurrencies.USDC}-${CurrencyAmountType[KnownCurrencies.USDC]}` | `${KnownCurrencies.WBTC}-${CurrencyAmountType[KnownCurrencies.WBTC]}`;
export declare type EventsDbKey = `${AvailableNetworks}-${CurrenciesKeys}`;
export declare type DepositsEventsDbKey = `deposits-${EventsDbKey}`;
export declare type WithdrawalsEventsDbKey = `withdrawals-${EventsDbKey}`;
export declare type Deposit = {
    leafIndex: number;
    commitment: string;
    timestamp: string;
    transactionHash: string;
    blockNumber: number;
};
export declare type DepositsTables = {
    [deposits in DepositsEventsDbKey]: {
        key: number;
        value: Deposit;
        indexes: {
            leafIndex: number;
            commitment: string;
        };
    };
};
export declare type Withdrawal = {
    to: string;
    fee: BigNumber;
    transactionHash: string;
    blockNumber: number;
    nullifierHex: string;
};
export declare type WithdrawalsTables = {
    [withdrawals in WithdrawalsEventsDbKey]: {
        key: string;
        value: Withdrawal;
        indexes: {
            nullifierHex: string;
        };
    };
};
export default interface ITornadoEventsDB extends DBSchema, DepositsTables, WithdrawalsTables {
    lastEvents: {
        key: string;
        value: {
            instance: string;
            lastQueriedBlock: number;
        };
        indexes: {
            instance: string;
        };
    };
}
