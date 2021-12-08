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
exports.updateTornadoEvents = exports.initTornadoEventsDB = exports.getTornadoEventsDb = exports.isInitialized = exports.TornadoEvents = void 0;
var TornadoEventsDB_1 = require("./TornadoEventsDB");
var TornadoEventsService_1 = require("./TornadoEventsService");
var config_1 = __importDefault(require("../config"));
var TornadoEvents;
(function (TornadoEvents) {
    TornadoEvents["DEPOSIT"] = "Deposit";
    TornadoEvents["WITHDRAWAL"] = "Withdrawal";
})(TornadoEvents = exports.TornadoEvents || (exports.TornadoEvents = {}));
var _tornadoEventsDb = undefined;
var _tornadoEventsService = new TornadoEventsService_1.TornadoEventsService({
    endpoint: config_1.default.tornadoEventsService.endpoint,
    version: config_1.default.tornadoEventsService.version,
});
var isInitialized = function () { return _tornadoEventsDb !== undefined; };
exports.isInitialized = isInitialized;
var getTornadoEventsDb = function () { return _tornadoEventsDb; };
exports.getTornadoEventsDb = getTornadoEventsDb;
var initTornadoEventsDB = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        _tornadoEventsDb = new TornadoEventsDB_1.TornadoEventsDB("blank_deposits_events", 1);
        return [2 /*return*/, _tornadoEventsDb.createStoreInstances()];
    });
}); };
exports.initTornadoEventsDB = initTornadoEventsDB;
var updateTornadoEvents = function (eventType, currencyAmountPair, _a, provider, contract, forceUpdate) {
    var network = _a.network, chainId = _a.chainId;
    if (forceUpdate === void 0) { forceUpdate = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fromBlockEvent, fromIndexEvent, fetchPromise, events;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!_tornadoEventsDb) {
                        throw new Error("The events db must be initialized first!");
                    }
                    fromBlockEvent = 0;
                    fromIndexEvent = 0;
                    if (!!forceUpdate) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.all([
                            _tornadoEventsDb.getLastQueriedBlock(eventType, network, currencyAmountPair),
                            _tornadoEventsDb.getLastEventIndex(eventType, network, currencyAmountPair),
                        ])];
                case 1:
                    _b = _c.sent(), fromBlockEvent = _b[0], fromIndexEvent = _b[1];
                    _c.label = 2;
                case 2:
                    if (eventType === TornadoEvents.DEPOSIT) {
                        fetchPromise = _tornadoEventsService.getDeposits({
                            chainId: chainId,
                            pair: currencyAmountPair,
                            from: fromIndexEvent,
                            chainOptions: { contract: contract, fromBlock: fromBlockEvent },
                            provider: provider,
                        });
                    }
                    else {
                        fetchPromise = _tornadoEventsService.getWithdrawals({
                            chainId: chainId,
                            pair: currencyAmountPair,
                            from: fromIndexEvent,
                            chainOptions: { contract: contract, fromBlock: fromBlockEvent },
                            provider: provider,
                        });
                    }
                    if (!forceUpdate) return [3 /*break*/, 4];
                    return [4 /*yield*/, _tornadoEventsDb.truncateEvents(network, currencyAmountPair, {
                            type: eventType,
                        })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [4 /*yield*/, fetchPromise];
                case 5:
                    events = _c.sent();
                    if (events.length) {
                        return [2 /*return*/, Promise.all([
                                // Update events
                                _tornadoEventsDb.updateEvents(network, currencyAmountPair, {
                                    type: eventType,
                                    events: eventType === TornadoEvents.DEPOSIT
                                        ? events
                                        : events,
                                }),
                                // Update last fetched block\
                                _tornadoEventsDb.updateLastQueriedBlock(eventType, network, currencyAmountPair, events.at(-1).blockNumber),
                            ])];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.updateTornadoEvents = updateTornadoEvents;
