import IndexedDB from "./IndexedDB";
import ITornadoEventsDB, { Deposit, DepositsEventsDbKey, Withdrawal } from "./ITornadoEventsDB";
import { AvailableNetworks, CurrencyAmountPair } from "../types";
import { TornadoEvents } from "./index";
export declare type EventsUpdateType = {
    type: TornadoEvents.DEPOSIT;
    events: Deposit[];
} | {
    type: TornadoEvents.WITHDRAWAL;
    events: Withdrawal[];
};
export declare class TornadoEventsDB extends IndexedDB<ITornadoEventsDB> {
    /**
     * getDepositTableName
     *
     * @param network The current network
     * @param param1 The destructured currency/amount pair
     * @returns The string formatted deposits store specified instance
     */
    getDepositTableName(network: AvailableNetworks, { currency, amount }: CurrencyAmountPair): DepositsEventsDbKey;
    /**
     * getWithdrawalTableName
     *
     * @param network The current network
     * @param param1 The destructured currency/amount pair
     * @returns The string formatted withdrawal store specified instance
     */
    private getWithdrawalTableName;
    /**
     * getStoreInstance
     *
     * @param eventType The event type
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns The string formatted specified instance
     */
    private getStoreInstanceName;
    /**
     * getLastQueriedBlock
     *
     * @param eventType The event type
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns The specified instance last queried block
     */
    getLastQueriedBlock(eventType: TornadoEvents, network: AvailableNetworks, pair: CurrencyAmountPair): Promise<number>;
    /**
     * It returns the last leaf index from the specified deposit events list
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns The specified instance last leaf index
     */
    getLastLeafIndex(network: AvailableNetworks, pair: CurrencyAmountPair): Promise<number>;
    getLastEventIndex(eventType: TornadoEvents, network: AvailableNetworks, pair: CurrencyAmountPair): Promise<number>;
    /**
     * updateLastQueriedBlock
     *
     * It updates the lastQueriedBlock for the specified instance
     * @param eventType The event type
     * @param network The current network
     * @param pair The currency/amount pair
     */
    updateLastQueriedBlock(eventType: TornadoEvents, network: AvailableNetworks, pair: CurrencyAmountPair, lastQueriedBlock: number): Promise<string | number>;
    /**
     * isSpent
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @param nullifier The nullifier hex to filter to
     *
     * @returns Whether or not the deposit has been spent
     */
    isSpent(network: AvailableNetworks, pair: CurrencyAmountPair, nullifier: string): Promise<boolean>;
    /**
     * getWithdrawalEventByNullifier
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @param nullifier The nullifier hex to filter to
     *
     * @returns The nullifier withdrawal event
     */
    getWithdrawalEventByNullifier(network: AvailableNetworks, pair: CurrencyAmountPair, nullifier: string): Promise<Withdrawal | undefined>;
    /**
     * getDepositEventByCommitment
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @param commitment The commitment to filter to
     *
     * @returns The commitment deposit event
     */
    getDepositEventByCommitment(network: AvailableNetworks, pair: CurrencyAmountPair, commitment: string): Promise<Deposit | undefined>;
    /**
     * getAllDepositsByLeafIndex
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns All the deposits events ordered by leafIndex
     */
    getAllDepositsByLeafIndex(network: AvailableNetworks, pair: CurrencyAmountPair, lastLeafIndex?: number): Promise<Deposit[]>;
    /**
     * getAllEvents
     *
     * @param eventType The event type
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns All the specified instance Tornado events
     */
    getAllEvents(eventType: TornadoEvents, network: AvailableNetworks, pair: CurrencyAmountPair): Promise<(Deposit | Withdrawal | {
        instance: string;
        lastQueriedBlock: number;
    })[]>;
    /**
     * createStoreInstances
     *
     * It creates the required store instances
     */
    createStoreInstances(): Promise<void>;
    /**
     * updateEvents
     *
     * It updates the list of events for the specified instance
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @param param2 The type/events object
     */
    updateEvents(network: AvailableNetworks, pair: CurrencyAmountPair, { type, events }: EventsUpdateType): Promise<void>;
    /**
     * truncateEvents
     *
     * It deletes all the events for the specified instance
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @param param2 The type/events object
     */
    truncateEvents(network: AvailableNetworks, pair: CurrencyAmountPair, { type }: EventsUpdateType): Promise<void>;
}
