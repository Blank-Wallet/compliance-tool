"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethers = exports.getComplianceInformation = exports.isValidNoteString = void 0;
var snarkjs_1 = require("snarkjs");
var circomlib_1 = require("circomlib");
var types_1 = require("./types");
var ethers_1 = require("ethers");
Object.defineProperty(exports, "ethers", { enumerable: true, get: function () { return ethers_1.ethers; } });
var events_1 = require("./events");
var config_1 = __importDefault(require("./config"));
var Mixer_abi_json_1 = __importDefault(require("./abi/Mixer.abi.json"));
// Set provider
var providers = {
    mainnet: undefined,
    goerli: undefined,
};
var getProvider = function (network) {
    if (providers[network] === undefined) {
        providers[network] = new ethers_1.ethers.providers.JsonRpcProvider(types_1.Endpoints[network]);
    }
    return providers[network];
};
/** BigNumber to hex string of specified length */
var toHex = function (number, length) {
    if (length === void 0) { length = 32; }
    var str = number instanceof Buffer
        ? number.toString("hex")
        : (0, snarkjs_1.bigInt)(number).toString(16);
    return "0x" + str.padStart(length * 2, "0");
};
var getPedersenHash = function (data) {
    return (0, snarkjs_1.bigInt)(circomlib_1.babyJub.unpackPoint(circomlib_1.pedersenHash.hash(data))[0]);
};
var parseDeposit = function (note) { return __awaiter(void 0, void 0, void 0, function () {
    var buf, nullifier, secret, preImage, commitment, commitmentHex, nullifierHash, nullifierHex;
    return __generator(this, function (_a) {
        buf = Buffer.from(note, "hex");
        nullifier = snarkjs_1.bigInt.leBuff2int(buf.slice(0, 31));
        secret = snarkjs_1.bigInt.leBuff2int(buf.slice(31, 62));
        preImage = Buffer.concat([
            nullifier.leInt2Buff(31),
            secret.leInt2Buff(31),
        ]);
        commitment = getPedersenHash(preImage);
        commitmentHex = toHex(commitment);
        nullifierHash = getPedersenHash(nullifier.leInt2Buff(31));
        nullifierHex = toHex(nullifierHash);
        return [2 /*return*/, {
                secret: secret,
                nullifier: nullifier,
                preImage: preImage,
                commitment: commitment,
                commitmentHex: commitmentHex,
                nullifierHash: nullifierHash,
                nullifierHex: nullifierHex,
            }];
    });
}); };
var isValidNoteString = function (noteString) {
    var noteRegex = /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<chainId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
    var match = noteRegex.exec(noteString);
    if (!match || !match.groups) {
        return false;
    }
    return true;
};
exports.isValidNoteString = isValidNoteString;
var getComplianceInformation = function (noteString) { return __awaiter(void 0, void 0, void 0, function () {
    var noteRegex, match, chainId, depositComplianceInfo, pair, note, network, parsedDeposit, networkKey, deployments, contractAddress, contract, depEv, spent, receipt, withdrawEv, timestamp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!(0, events_1.isInitialized)()) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, events_1.initTornadoEventsDB)()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                noteRegex = /tornado-(?<currency>\w+)-(?<amount>[\d.]+)-(?<chainId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
                match = noteRegex.exec(noteString);
                if (!match || !match.groups) {
                    throw new Error("The note has invalid format");
                }
                chainId = parseInt(match.groups.chainId);
                if (!(chainId in types_1.Networks)) {
                    throw new Error("This note is from an invalid network");
                }
                depositComplianceInfo = {
                    deposit: {},
                    withdrawal: {},
                    chainId: chainId,
                };
                pair = {
                    currency: match.groups.currency,
                    amount: match.groups.amount,
                };
                note = match.groups.note;
                network = types_1.Networks[chainId];
                return [4 /*yield*/, parseDeposit(note)];
            case 3:
                parsedDeposit = _a.sent();
                networkKey = "netId".concat(chainId);
                deployments = config_1.default.deployments;
                contractAddress = deployments[networkKey][pair.currency].instanceAddress[pair.amount];
                contract = new ethers_1.Contract(contractAddress, Mixer_abi_json_1.default, getProvider(network));
                // Update deposit events
                return [4 /*yield*/, (0, events_1.updateTornadoEvents)(events_1.TornadoEvents.DEPOSIT, pair, { network: network, chainId: chainId }, getProvider(network), contract)];
            case 4:
                // Update deposit events
                _a.sent();
                // Update withdrawal events
                return [4 /*yield*/, (0, events_1.updateTornadoEvents)(events_1.TornadoEvents.WITHDRAWAL, pair, { network: network, chainId: chainId }, getProvider(network), contract)];
            case 5:
                // Update withdrawal events
                _a.sent();
                return [4 /*yield*/, (0, events_1.getTornadoEventsDb)().getDepositEventByCommitment(network, pair, parsedDeposit.commitmentHex)];
            case 6:
                depEv = _a.sent();
                if (!depEv) {
                    throw new Error("Deposit not found on events");
                }
                return [4 /*yield*/, (0, events_1.getTornadoEventsDb)().isSpent(network, pair, parsedDeposit.nullifierHex)];
            case 7:
                spent = _a.sent();
                return [4 /*yield*/, getProvider(network).getTransactionReceipt(depEv.transactionHash)];
            case 8:
                receipt = _a.sent();
                depositComplianceInfo.deposit = {
                    pair: pair,
                    spent: spent || false,
                    timestamp: new Date(Number(depEv.timestamp) * 1000),
                    commitment: parsedDeposit.commitmentHex,
                    transactionHash: depEv.transactionHash,
                    from: receipt.from,
                };
                if (!spent) {
                    return [2 /*return*/, depositComplianceInfo];
                }
                return [4 /*yield*/, (0, events_1.getTornadoEventsDb)().getWithdrawalEventByNullifier(network, pair, parsedDeposit.nullifierHex)];
            case 9:
                withdrawEv = _a.sent();
                if (!withdrawEv) {
                    // Deposit has not been withdrawn yet
                    return [2 /*return*/, depositComplianceInfo];
                }
                return [4 /*yield*/, getProvider(network).getBlock(withdrawEv.blockNumber)];
            case 10:
                timestamp = (_a.sent()).timestamp;
                depositComplianceInfo.withdrawal = {
                    pair: pair,
                    to: withdrawEv.to,
                    transactionHash: withdrawEv.transactionHash,
                    timestamp: new Date(timestamp * 1000),
                    fee: ethers_1.utils.formatUnits(ethers_1.BigNumber.from(withdrawEv.fee), (0, types_1.getTokenDecimals)(chainId, pair)),
                    feeBN: ethers_1.BigNumber.from(withdrawEv.fee),
                    nullifier: parsedDeposit.nullifierHex,
                };
                return [2 /*return*/, depositComplianceInfo];
        }
    });
}); };
exports.getComplianceInformation = getComplianceInformation;
