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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTornadoEvents = exports.initTornadoEventsDB = exports.getTornadoEventsDb = exports.isInitialized = exports.TornadoEvents = void 0;
var TornadoEventsDB_1 = require("./TornadoEventsDB");
var TornadoEvents;
(function (TornadoEvents) {
    TornadoEvents["DEPOSIT"] = "Deposit";
    TornadoEvents["WITHDRAWAL"] = "Withdrawal";
})(TornadoEvents = exports.TornadoEvents || (exports.TornadoEvents = {}));
var _tornadoEventsDb = undefined;
var isInitialized = function () { return _tornadoEventsDb !== undefined; };
exports.isInitialized = isInitialized;
var getTornadoEventsDb = function () { return _tornadoEventsDb; };
exports.getTornadoEventsDb = getTornadoEventsDb;
var initTornadoEventsDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        _tornadoEventsDb = new TornadoEventsDB_1.TornadoEventsDB('blank_deposits_events', 1);
        return [2 /*return*/, _tornadoEventsDb.createStoreInstances()];
    });
}); };
exports.initTornadoEventsDB = initTornadoEventsDB;
var updateTornadoEvents = function (eventType, currencyAmountPair, network, provider, contract, forceUpdate) {
    if (forceUpdate === void 0) { forceUpdate = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fetchEvents, lastQueriedBlock, fromBlockEvent, _a, events, newLastQueriedBlock, parsedEvents;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!_tornadoEventsDb) {
                        throw new Error('The events db must be initialized first!');
                    }
                    fetchEvents = function (fromBlock, toBlock) {
                        if (toBlock === void 0) { toBlock = 'latest'; }
                        return __awaiter(void 0, void 0, void 0, function () {
                            var filter, blockNumber, getLogsPaginated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        filter = contract.filters[eventType]();
                                        return [4 /*yield*/, provider.getBlockNumber()];
                                    case 1:
                                        blockNumber = _a.sent();
                                        if (toBlock === 'latest') {
                                            toBlock = blockNumber;
                                        }
                                        getLogsPaginated = function (fromBlock, toBlock, obtainedEvents) {
                                            if (obtainedEvents === void 0) { obtainedEvents = []; }
                                            return __awaiter(void 0, void 0, void 0, function () {
                                                var events_1, error_1, errCode, toNextBlock;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            return [4 /*yield*/, contract.queryFilter(filter, fromBlock, toBlock)];
                                                        case 1:
                                                            events_1 = _a.sent();
                                                            if (toBlock < blockNumber) {
                                                                return [2 /*return*/, getLogsPaginated(toBlock + 1, blockNumber, __spreadArray(__spreadArray([], obtainedEvents), events_1))];
                                                            }
                                                            else {
                                                                return [2 /*return*/, {
                                                                        events: __spreadArray(__spreadArray([], obtainedEvents), events_1),
                                                                        lastQueriedBlock: blockNumber,
                                                                    }];
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            error_1 = _a.sent();
                                                            if (error_1.body) {
                                                                errCode = JSON.parse(error_1.body).error.code;
                                                                // More than 10k results
                                                                if (errCode === -32005) {
                                                                    toNextBlock = fromBlock + Math.floor((blockNumber - fromBlock) / 2);
                                                                    return [2 /*return*/, getLogsPaginated(fromBlock, toNextBlock, obtainedEvents)];
                                                                }
                                                            }
                                                            throw new Error('Unable to fetch the events');
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        };
                                        return [2 /*return*/, getLogsPaginated(fromBlock, toBlock)];
                                }
                            });
                        });
                    };
                    return [4 /*yield*/, _tornadoEventsDb.getLastQueriedBlock(eventType, network, currencyAmountPair)];
                case 1:
                    lastQueriedBlock = _b.sent();
                    fromBlockEvent = lastQueriedBlock !== 0 ? lastQueriedBlock + 1 : 0;
                    // If forceUpdate is set to true we fetch every event from block 0
                    if (forceUpdate) {
                        fromBlockEvent = 0;
                    }
                    return [4 /*yield*/, fetchEvents(fromBlockEvent)];
                case 2:
                    _a = _b.sent(), events = _a.events, newLastQueriedBlock = _a.lastQueriedBlock;
                    parsedEvents = eventType === TornadoEvents.DEPOSIT
                        ? {
                            type: eventType,
                            events: events.map(function (ev) {
                                var _a, _b, _c;
                                return ({
                                    transactionHash: ev.transactionHash,
                                    blockNumber: ev.blockNumber,
                                    commitment: (_a = ev.args) === null || _a === void 0 ? void 0 : _a.commitment,
                                    leafIndex: (_b = ev.args) === null || _b === void 0 ? void 0 : _b.leafIndex,
                                    timestamp: (_c = ev.args) === null || _c === void 0 ? void 0 : _c.timestamp.toString(),
                                });
                            }),
                        }
                        : {
                            type: eventType,
                            events: events.map(function (ev) {
                                var _a, _b, _c;
                                return ({
                                    transactionHash: ev.transactionHash,
                                    blockNumber: ev.blockNumber,
                                    to: (_a = ev.args) === null || _a === void 0 ? void 0 : _a.to,
                                    nullifierHex: (_b = ev.args) === null || _b === void 0 ? void 0 : _b.nullifierHash,
                                    fee: (_c = ev.args) === null || _c === void 0 ? void 0 : _c.fee,
                                });
                            }),
                        };
                    // Update events
                    return [4 /*yield*/, _tornadoEventsDb.updateEvents(network, currencyAmountPair, parsedEvents)];
                case 3:
                    // Update events
                    _b.sent();
                    // Update last fetched block
                    return [4 /*yield*/, _tornadoEventsDb.updateLastQueriedBlock(eventType, network, currencyAmountPair, newLastQueriedBlock)];
                case 4:
                    // Update last fetched block
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.updateTornadoEvents = updateTornadoEvents;
