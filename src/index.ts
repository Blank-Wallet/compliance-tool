import { bigInt } from "snarkjs";
import { babyJub, pedersenHash } from "circomlib";
import {
  AvailableNetworks,
  ComplianceInfo,
  Endpoints,
  getTornadoTokenDecimals,
  KnownCurrencies,
  Networks,
} from "./types";

import { BigNumber, Contract, ethers, utils } from "ethers";
import {
  getTornadoEventsDb,
  initTornadoEventsDB,
  isInitialized,
  TornadoEvents,
  updateTornadoEvents,
} from "./events";
import config from "./config";
import MixerAbi from "./abi/Mixer.abi.json";

// Set provider
const providers: {
  [network in AvailableNetworks]: ethers.providers.JsonRpcProvider | undefined;
} = {
  mainnet: undefined,
  goerli: undefined,
  bsc: undefined,
  polygon: undefined,
  arbitrum: undefined,
  optimism: undefined,
  avalanchec: undefined,
  xdai: undefined
};

const getProvider = (network: AvailableNetworks) => {
  if (providers[network] === undefined) {
    providers[network] = new ethers.providers.JsonRpcProvider(
      Endpoints[network]
    );
  }

  return providers[network]!;
};

/** BigNumber to hex string of specified length */
const toHex = (number: any, length = 32) => {
  const str =
    number instanceof Buffer
      ? number.toString("hex")
      : bigInt(number).toString(16);
  return "0x" + str.padStart(length * 2, "0");
};

const getPedersenHash = (data: Buffer): any => {
  return bigInt(babyJub.unpackPoint(pedersenHash.hash(data))[0]);
};

const parseDeposit = async (note: string) => {
  const buf = Buffer.from(note, "hex");

  const nullifier = bigInt.leBuff2int(buf.slice(0, 31));
  const secret = bigInt.leBuff2int(buf.slice(31, 62));
  const preImage = Buffer.concat([
    nullifier.leInt2Buff(31),
    secret.leInt2Buff(31),
  ]);

  const commitment = getPedersenHash(preImage);
  const commitmentHex = toHex(commitment);

  const nullifierHash = getPedersenHash(nullifier.leInt2Buff(31));

  const nullifierHex = toHex(nullifierHash);

  return {
    secret,
    nullifier,
    preImage,
    commitment,
    commitmentHex,
    nullifierHash,
    nullifierHex,
  };
};

export const isValidNoteString = (noteString: string) => {
  const noteRegex =
    /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<chainId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  const match = noteRegex.exec(noteString);
  if (!match || !match.groups) {
    return false;
  }

  return true;
};

export const getComplianceInformation = async (
  noteString: string
): Promise<ComplianceInfo> => {
  if (!isInitialized()) {
    await initTornadoEventsDB();
  }

  const noteRegex =
    /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<chainId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
  const match = noteRegex.exec(noteString);
  if (!match || !match.groups) {
    throw new Error("The note has invalid format");
  }

  const chainId = parseInt(match.groups.chainId);
  if (!(chainId in Networks)) {
    throw new Error("This note is from an invalid network");
  }

  const depositComplianceInfo = {
    deposit: {},
    withdrawal: {},
    chainId,
  } as ComplianceInfo;

  const pair = {
    currency: match.groups.currency as KnownCurrencies,
    amount: match.groups.amount,
  };

  const note = match.groups.note;

  const network = Networks[chainId];
  const parsedDeposit = await parseDeposit(note);

  // Init contract
  const networkKey = `netId${chainId}`;
  const { deployments } = config;
  const contractAddress: string = (deployments as any)[networkKey].currencies[
    pair.currency
  ].instances[pair.amount].address;
  const contract = new Contract(
    contractAddress,
    MixerAbi,
    getProvider(network as AvailableNetworks)
  );

  // Update deposit events
  await updateTornadoEvents(
    TornadoEvents.DEPOSIT,
    pair,
    { network: network as AvailableNetworks, chainId },
    getProvider(network as AvailableNetworks),
    contract
  );

  // Update withdrawal events
  await updateTornadoEvents(
    TornadoEvents.WITHDRAWAL,
    pair,
    { network: network as AvailableNetworks, chainId },
    getProvider(network as AvailableNetworks),
    contract
  );

  const depEv = await getTornadoEventsDb()!.getDepositEventByCommitment(
    network as AvailableNetworks,
    pair,
    parsedDeposit.commitmentHex
  );

  if (!depEv) {
    throw new Error("Deposit not found on events");
  }

  const spent = await getTornadoEventsDb()!.isSpent(
    network as AvailableNetworks,
    pair,
    parsedDeposit.nullifierHex
  );

  // Get transaction receipt
  const receipt = await getProvider(
    network as AvailableNetworks
  ).getTransactionReceipt(depEv.transactionHash);

  depositComplianceInfo.deposit = {
    pair: pair,
    spent: spent || false,
    timestamp: new Date(Number(depEv.timestamp) * 1000),
    commitment: parsedDeposit.commitmentHex,
    transactionHash: depEv.transactionHash,
    from: receipt.from,
  };

  if (!spent) {
    return depositComplianceInfo;
  }

  const withdrawEv = await getTornadoEventsDb()!.getWithdrawalEventByNullifier(
    network as AvailableNetworks,
    pair,
    parsedDeposit.nullifierHex
  );

  if (!withdrawEv) {
    // Deposit has not been withdrawn yet
    return depositComplianceInfo;
  }

  // Get timestamp
  const { timestamp } = await getProvider(
    network as AvailableNetworks
  ).getBlock(withdrawEv.blockNumber);

  depositComplianceInfo.withdrawal = {
    pair: pair,
    to: withdrawEv.to,
    transactionHash: withdrawEv.transactionHash,
    timestamp: new Date(timestamp * 1000),
    fee: utils.formatUnits(
      BigNumber.from(withdrawEv.fee),
      getTornadoTokenDecimals(chainId, pair)
    ),
    feeBN: BigNumber.from(withdrawEv.fee),
    nullifier: parsedDeposit.nullifierHex,
  };

  return depositComplianceInfo;
};

export { ethers };
