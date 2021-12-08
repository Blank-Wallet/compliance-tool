import { Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { CurrencyAmountPair } from "../types";
import { Deposit, Withdrawal } from "./ITornadoEventsDB";
export interface TornadoEventsServiceProps {
    endpoint: string;
    version: string;
}
export interface EventsChainFetchOptions {
    fromBlock: number;
    contract: Contract;
}
export interface EventsFetchOptions {
    chainId: number;
    pair: CurrencyAmountPair;
    from?: number;
    chainOptions: EventsChainFetchOptions;
    provider: JsonRpcProvider;
}
export declare class TornadoEventsService {
    private _endpoint;
    constructor(props: TornadoEventsServiceProps);
    getDeposits({ chainId, pair: { currency, amount }, from, chainOptions, provider, }: EventsFetchOptions): Promise<Deposit[]>;
    getWithdrawals({ chainId, pair: { currency, amount }, from, chainOptions, provider, }: EventsFetchOptions): Promise<Withdrawal[]>;
    private _getEvents;
    private _getPaginated;
    private _fetchEventsFromChain;
    private _parseEndpoint;
}
