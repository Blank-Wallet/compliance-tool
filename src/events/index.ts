import { Contract, ethers, Event } from "ethers";
import { AvailableNetworks, KnownCurrencies } from "../types";
import ITornadoEventsDB, { DepositsEventsDbKey, WithdrawalsEventsDbKey } from "./ITornadoEventsDB";
import { TornadoEventsDB } from "./TornadoEventsDB";

export enum TornadoEvents {
    DEPOSIT = 'Deposit',
    WITHDRAWAL = 'Withdrawal',
}

let _tornadoEventsDb: TornadoEventsDB | undefined = undefined

export const isInitialized = () => _tornadoEventsDb !== undefined
export const getTornadoEventsDb = () => _tornadoEventsDb

export const initTornadoEventsDB = async() => {
    _tornadoEventsDb = new TornadoEventsDB('blank_deposits_events', 1);
    return _tornadoEventsDb.createStoreInstances()
}

export const updateTornadoEvents = async (
    eventType: TornadoEvents,
    currencyAmountPair: {currency: KnownCurrencies, amount: string},
    network: AvailableNetworks,
    provider: ethers.providers.JsonRpcProvider,
    contract: Contract,
    forceUpdate: boolean = false,
  ) => {
    if(!_tornadoEventsDb) {
        throw new Error('The events db must be initialized first!')
    }

    const fetchEvents = async (
      fromBlock: number,
      toBlock: number | 'latest' = 'latest',
    ): Promise<{ events: Event[]; lastQueriedBlock: number }> => {
      const filter = contract.filters[eventType]();
      const blockNumber = await provider.getBlockNumber();

      if (toBlock === 'latest') {
        toBlock = blockNumber;
      }

      const getLogsPaginated = async (
        fromBlock: number,
        toBlock: number,
        obtainedEvents: Event[] = [],
      ): Promise<{ events: Event[]; lastQueriedBlock: number }> => {
        try {
          const events = await contract.queryFilter(filter, fromBlock, toBlock);
          if (toBlock < blockNumber) {
            return getLogsPaginated(toBlock + 1, blockNumber, [
              ...obtainedEvents,
              ...events,
            ]);
          } else {
            return {
              events: [...obtainedEvents, ...events],
              lastQueriedBlock: blockNumber,
            };
          }
        } catch (error) {
          if (error.body) {
            const errCode = JSON.parse(error.body).error.code;
            // More than 10k results
            if (errCode === -32005) {
              const toNextBlock =
                fromBlock + Math.floor((blockNumber - fromBlock) / 2);
              return getLogsPaginated(fromBlock, toNextBlock, obtainedEvents);
            }
          }
          throw new Error('Unable to fetch the events');
        }
      };

      return getLogsPaginated(fromBlock, toBlock);
    };

    // Get last queried block
    const lastQueriedBlock = await _tornadoEventsDb.getLastQueriedBlock(
      eventType,
      network as AvailableNetworks,
      currencyAmountPair,
    );
    let fromBlockEvent = lastQueriedBlock !== 0 ? lastQueriedBlock + 1 : 0;

    // If forceUpdate is set to true we fetch every event from block 0
    if (forceUpdate) {
      fromBlockEvent = 0;
    }

    // Fetch events from next to last queried block
    const { events, lastQueriedBlock: newLastQueriedBlock } = await fetchEvents(
      fromBlockEvent,
    );

    // Parse obtained events
    const parsedEvents =
      eventType === TornadoEvents.DEPOSIT
        ? {
            type: eventType,
            events: events.map(
              (ev: Event) =>
                ({
                  transactionHash: ev.transactionHash,
                  blockNumber: ev.blockNumber,
                  commitment: ev.args?.commitment,
                  leafIndex: ev.args?.leafIndex,
                  timestamp: ev.args?.timestamp.toString(),
                } as ITornadoEventsDB[DepositsEventsDbKey]['value']),
            ),
          }
        : {
            type: eventType,
            events: events.map(
              (ev: Event) =>
                ({
                  transactionHash: ev.transactionHash,
                  blockNumber: ev.blockNumber,
                  to: ev.args?.to,
                  nullifierHex: ev.args?.nullifierHash,
                  fee: ev.args?.fee,
                } as ITornadoEventsDB[WithdrawalsEventsDbKey]['value']),
            ),
          };

    // Update events
    await _tornadoEventsDb.updateEvents(
      network as AvailableNetworks,
      currencyAmountPair,
      parsedEvents,
    );

    // Update last fetched block
    await _tornadoEventsDb.updateLastQueriedBlock(
      eventType,
      network as AvailableNetworks,
      currencyAmountPair,
      newLastQueriedBlock,
    );
  };