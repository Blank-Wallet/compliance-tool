import { Contract, ethers } from "ethers";
import { AvailableNetworks, KnownCurrencies } from "../types";
import { TornadoEventsDB } from "./TornadoEventsDB";
export declare enum TornadoEvents {
    DEPOSIT = "Deposit",
    WITHDRAWAL = "Withdrawal"
}
export declare const isInitialized: () => boolean;
export declare const getTornadoEventsDb: () => TornadoEventsDB | undefined;
export declare const initTornadoEventsDB: () => Promise<void>;
export declare const updateTornadoEvents: (eventType: TornadoEvents, currencyAmountPair: {
    currency: KnownCurrencies;
    amount: string;
}, network: AvailableNetworks, provider: ethers.providers.JsonRpcProvider, contract: Contract, forceUpdate?: boolean) => Promise<void>;
