import { Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { AvailableNetworks, KnownCurrencies } from "../types";
import { Deposit, Withdrawal } from "./ITornadoEventsDB";
import { EventsUpdateType, TornadoEventsDB } from "./TornadoEventsDB";
import { TornadoEventsService } from "./TornadoEventsService";
import config from "../config";

const tornadoDeployments = config.deployments as any;

export enum TornadoEvents {
  DEPOSIT = "Deposit",
  WITHDRAWAL = "Withdrawal",
}

let _tornadoEventsDb: TornadoEventsDB | undefined = undefined;
let _tornadoEventsService: TornadoEventsService = new TornadoEventsService({
  endpoint: config.tornadoEventsService.endpoint,
  version: config.tornadoEventsService.version,
});

export const isInitialized = () => _tornadoEventsDb !== undefined;
export const getTornadoEventsDb = () => _tornadoEventsDb;

export const initTornadoEventsDB = async () => {
  _tornadoEventsDb = new TornadoEventsDB("blank_deposits_events", 1);
  return _tornadoEventsDb.createStoreInstances();
};

export const updateTornadoEvents = async (
  eventType: TornadoEvents,
  currencyAmountPair: { currency: KnownCurrencies; amount: string },
  { network, chainId }: { network: AvailableNetworks; chainId: number },
  provider: JsonRpcProvider,
  contract: Contract,
  forceUpdate = false
) => {
  if (!_tornadoEventsDb) {
    throw new Error("The events db must be initialized first!");
  }

  let fromBlockEvent =
    tornadoDeployments[`netId${chainId}`].currencies[
      currencyAmountPair.currency
    ].instances[currencyAmountPair.amount].initialBlock;

  let fromIndexEvent = 0;

  if (!forceUpdate) {
    [fromBlockEvent, fromIndexEvent] = await Promise.all([
      _tornadoEventsDb.getLastQueriedBlock(
        eventType,
        network,
        currencyAmountPair
      ),
      _tornadoEventsDb.getLastEventIndex(
        eventType,
        network,
        currencyAmountPair
      ),
    ]);
  }

  let fetchPromise: Promise<Deposit[] | Withdrawal[]>;

  if (eventType === TornadoEvents.DEPOSIT) {
    fetchPromise = _tornadoEventsService.getDeposits({
      chainId: chainId,
      pair: currencyAmountPair,
      from: fromIndexEvent,
      chainOptions: { contract, fromBlock: fromBlockEvent },
      provider,
    });
  } else {
    fetchPromise = _tornadoEventsService.getWithdrawals({
      chainId: chainId,
      pair: currencyAmountPair,
      from: fromIndexEvent,
      chainOptions: { contract, fromBlock: fromBlockEvent },
      provider,
    });
  }

  if (forceUpdate) {
    await _tornadoEventsDb.truncateEvents(network, currencyAmountPair, {
      type: eventType,
    } as EventsUpdateType);
  }

  const events = await fetchPromise;

  if (events.length) {
    return Promise.all([
      // Update events
      _tornadoEventsDb.updateEvents(network, currencyAmountPair, {
        type: eventType,
        events:
          eventType === TornadoEvents.DEPOSIT
            ? (events as Deposit[])
            : (events as Withdrawal[]),
      } as EventsUpdateType),

      // Update last fetched block\
      _tornadoEventsDb.updateLastQueriedBlock(
        eventType,
        network,
        currencyAmountPair,
        events.at(-1)!.blockNumber
      ),
    ]) as unknown as Promise<void>;
  }
};
