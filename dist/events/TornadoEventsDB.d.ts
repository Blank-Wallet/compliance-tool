import ITornadoEventsDB, { DepositsEventsDbKey, WithdrawalsEventsDbKey } from './ITornadoEventsDB';
import { TornadoEvents } from './index';
import IndexedDB from './IndexedDB';
import { AvailableNetworks, CurrencyAmountPair } from '../types';
export declare type EventsUpdateType = {
    type: TornadoEvents.DEPOSIT;
    events: ITornadoEventsDB[DepositsEventsDbKey]['value'][];
} | {
    type: TornadoEvents.WITHDRAWAL;
    events: ITornadoEventsDB[WithdrawalsEventsDbKey]['value'][];
};
export declare class TornadoEventsDB extends IndexedDB<ITornadoEventsDB> {
    /**
     * getDepositTableName
     *
     * @param network The current network
     * @param param1 The destructured currency/amount pair
     * @returns The string formatted deposits store specified instance
     */
    getDepositTableName(network: AvailableNetworks, { currency, amount }: CurrencyAmountPair): "deposits-mainnet-eth-0.1" | "deposits-mainnet-eth-1" | "deposits-mainnet-eth-10" | "deposits-mainnet-eth-100" | "deposits-mainnet-dai-100" | "deposits-mainnet-dai-1000" | "deposits-mainnet-dai-10000" | "deposits-mainnet-dai-100000" | "deposits-mainnet-cdai-5000" | "deposits-mainnet-cdai-50000" | "deposits-mainnet-cdai-500000" | "deposits-mainnet-cdai-5000000" | "deposits-mainnet-usdt-100" | "deposits-mainnet-usdt-1000" | "deposits-mainnet-usdc-100" | "deposits-mainnet-usdc-1000" | "deposits-mainnet-wbtc-0.1" | "deposits-mainnet-wbtc-1" | "deposits-mainnet-wbtc-10" | "deposits-goerli-eth-0.1" | "deposits-goerli-eth-1" | "deposits-goerli-eth-10" | "deposits-goerli-eth-100" | "deposits-goerli-dai-100" | "deposits-goerli-dai-1000" | "deposits-goerli-dai-10000" | "deposits-goerli-dai-100000" | "deposits-goerli-cdai-5000" | "deposits-goerli-cdai-50000" | "deposits-goerli-cdai-500000" | "deposits-goerli-cdai-5000000" | "deposits-goerli-usdt-100" | "deposits-goerli-usdt-1000" | "deposits-goerli-usdc-100" | "deposits-goerli-usdc-1000" | "deposits-goerli-wbtc-0.1" | "deposits-goerli-wbtc-1" | "deposits-goerli-wbtc-10";
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
    getWithdrawalEventByNullifier(network: AvailableNetworks, pair: CurrencyAmountPair, nullifier: string): Promise<{
        to: string;
        fee: import("ethers").BigNumber;
        transactionHash: string;
        blockNumber: number;
        nullifierHex: string;
    } | undefined>;
    /**
     * getDepositEventByCommitment
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @param commitment The commitment to filter to
     *
     * @returns The commitment deposit event
     */
    getDepositEventByCommitment(network: AvailableNetworks, pair: CurrencyAmountPair, commitment: string): Promise<{
        leafIndex: number;
        commitment: string;
        timestamp: string;
        transactionHash: string;
        blockNumber: number;
    } | undefined>;
    /**
     * getAllDepositsByLeafIndex
     *
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns All the deposits events ordered by leafIndex
     */
    getAllDepositsByLeafIndex(network: AvailableNetworks, pair: CurrencyAmountPair, lastLeafIndex?: number): Promise<{
        leafIndex: number;
        commitment: string;
        timestamp: string;
        transactionHash: string;
        blockNumber: number;
    }[]>;
    /**
     * getAllEvents
     *
     * @param eventType The event type
     * @param network The current network
     * @param pair The currency/amount pair
     * @returns All the specified instance Tornado events
     */
    getAllEvents(eventType: TornadoEvents, network: AvailableNetworks, pair: CurrencyAmountPair): Promise<({
        leafIndex: number;
        commitment: string;
        timestamp: string;
        transactionHash: string;
        blockNumber: number;
    } | {
        to: string;
        fee: import("ethers").BigNumber;
        transactionHash: string;
        blockNumber: number;
        nullifierHex: string;
    } | {
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
}
