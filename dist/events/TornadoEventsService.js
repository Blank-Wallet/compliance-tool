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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TornadoEventsService = void 0;
var axios_1 = __importDefault(require("axios"));
var ethers_1 = require("ethers");
var ethereumjs_util_1 = require("ethereumjs-util");
var index_1 = require("./index");
var MAX_HTTP_RETRIES = 5;
var RETRIES_DELAY = 500;
var TornadoEventsService = /** @class */ (function () {
    function TornadoEventsService(props) {
        var _this = this;
        this._fetchEventsFromChain = function (type, fromBlock, contract, provider, toBlock) {
            if (toBlock === void 0) { toBlock = "latest"; }
            return __awaiter(_this, void 0, void 0, function () {
                var filter, blockNumber, _toBlock, getLogsPaginated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            filter = contract.filters[type]();
                            return [4 /*yield*/, provider.getBlockNumber()];
                        case 1:
                            blockNumber = _a.sent();
                            _toBlock = 0;
                            if (toBlock === "latest") {
                                _toBlock = blockNumber;
                            }
                            else {
                                _toBlock = toBlock;
                            }
                            getLogsPaginated = function (fromBlock, toBlock, obtainedEvents) {
                                if (obtainedEvents === void 0) { obtainedEvents = []; }
                                return __awaiter(_this, void 0, void 0, function () {
                                    var events, error_1, toNextBlock;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, contract.queryFilter(filter, fromBlock, toBlock)];
                                            case 1:
                                                events = _a.sent();
                                                if (toBlock < blockNumber) {
                                                    return [2 /*return*/, getLogsPaginated(toBlock + 1, blockNumber, __spreadArray(__spreadArray([], obtainedEvents, true), events, true))];
                                                }
                                                else {
                                                    return [2 /*return*/, __spreadArray(__spreadArray([], obtainedEvents, true), events, true)];
                                                }
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_1 = _a.sent();
                                                if (error_1.body) {
                                                    toNextBlock = fromBlock + Math.floor((toBlock - fromBlock) / 2);
                                                    return [2 /*return*/, getLogsPaginated(fromBlock, toNextBlock, obtainedEvents)];
                                                }
                                                throw new Error("Unable to fetch the events");
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                });
                            };
                            return [2 /*return*/, getLogsPaginated(fromBlock, _toBlock)];
                    }
                });
            });
        };
        this._endpoint = this._parseEndpoint(props.endpoint, props.version);
    }
    TornadoEventsService.prototype.getDeposits = function (_a) {
        var chainId = _a.chainId, _b = _a.pair, currency = _b.currency, amount = _b.amount, from = _a.from, chainOptions = _a.chainOptions, provider = _a.provider;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, this._getEvents("deposits", chainId, currency, amount, chainOptions, provider, from)];
            });
        });
    };
    TornadoEventsService.prototype.getWithdrawals = function (_a) {
        var chainId = _a.chainId, _b = _a.pair, currency = _b.currency, amount = _b.amount, from = _a.from, chainOptions = _a.chainOptions, provider = _a.provider;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, this._getEvents("withdrawals", chainId, currency, amount, chainOptions, provider, from)];
            });
        });
    };
    TornadoEventsService.prototype._getEvents = function (type, chainId, currency, amount, chainOptions, provider, from) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var events, results, i, result, e_1, results, i, ev;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        events = [];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this._getPaginated(type, chainId, currency, amount, from || 0)];
                    case 2:
                        results = _g.sent();
                        for (i = 0; i < results.length; i++) {
                            result = results[i];
                            if (type == "deposits") {
                                events.push({
                                    leafIndex: parseInt((result["li"] || "0").toString()),
                                    commitment: (0, ethereumjs_util_1.addHexPrefix)(result["c"].toString()),
                                    timestamp: result["t"].toString(),
                                    transactionHash: result["th"].toString(),
                                    blockNumber: parseInt(result["bn"].toString()),
                                });
                            }
                            else {
                                events.push({
                                    nullifierHex: (0, ethereumjs_util_1.addHexPrefix)(result["nh"].toString()),
                                    to: result["t"].toString(),
                                    fee: ethers_1.BigNumber.from(result["f"].toString()),
                                    transactionHash: result["th"].toString(),
                                    blockNumber: parseInt(result["bn"].toString()),
                                });
                            }
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _g.sent();
                        console.error("Error fetching tornado events from service: ".concat(e_1.message));
                        return [4 /*yield*/, this._fetchEventsFromChain(type == "deposits" ? index_1.TornadoEvents.DEPOSIT : index_1.TornadoEvents.WITHDRAWAL, chainOptions.fromBlock, chainOptions.contract, provider)];
                    case 4:
                        results = _g.sent();
                        for (i = 0; i < results.length; i++) {
                            ev = results[i];
                            if (type == "deposits") {
                                events.push({
                                    transactionHash: ev.transactionHash,
                                    blockNumber: ev.blockNumber,
                                    commitment: (_a = ev.args) === null || _a === void 0 ? void 0 : _a.commitment,
                                    leafIndex: (_b = ev.args) === null || _b === void 0 ? void 0 : _b.leafIndex,
                                    timestamp: (_c = ev.args) === null || _c === void 0 ? void 0 : _c.timestamp.toString(),
                                });
                            }
                            else {
                                events.push({
                                    transactionHash: ev.transactionHash,
                                    blockNumber: ev.blockNumber,
                                    to: (_d = ev.args) === null || _d === void 0 ? void 0 : _d.to,
                                    nullifierHex: (_e = ev.args) === null || _e === void 0 ? void 0 : _e.nullifierHash,
                                    fee: (_f = ev.args) === null || _f === void 0 ? void 0 : _f.fee,
                                });
                            }
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, events];
                }
            });
        });
    };
    TornadoEventsService.prototype._getPaginated = function (type, chain_id, currency, amount, from, retry) {
        if (retry === void 0) { retry = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var results, url, response, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        results = [];
                        url = "".concat(this._endpoint, "/").concat(type);
                        return [4 /*yield*/, axios_1.default.get(url, {
                                params: {
                                    chain_id: chain_id,
                                    currency: currency,
                                    amount: amount,
                                    from: from,
                                },
                            })];
                    case 1:
                        response = _d.sent();
                        if (!(response.status != 200)) return [3 /*break*/, 4];
                        if (!(retry < MAX_HTTP_RETRIES)) return [3 /*break*/, 3];
                        console.debug("Communication error, retrying: ".concat(JSON.stringify(response.data), " ").concat(JSON.stringify(response.status)));
                        retry = retry + 1;
                        return [4 /*yield*/, delay(RETRIES_DELAY * retry)];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, this._getPaginated(type, chain_id, currency, amount, from, retry)];
                    case 3: throw new Error("Error fetching ".concat(url, ". ").concat(JSON.stringify(response.data), " ").concat(JSON.stringify(response.status)));
                    case 4:
                        if (type in response.data) {
                            if (response.data[type].length) {
                                results.push.apply(results, response.data[type]);
                            }
                        }
                        if (!("last" in response.data)) return [3 /*break*/, 6];
                        _b = (_a = results.push).apply;
                        _c = [results];
                        return [4 /*yield*/, this._getPaginated(type, chain_id, currency, amount, parseInt(response.data["last"]))];
                    case 5:
                        _b.apply(_a, _c.concat([(_d.sent())]));
                        _d.label = 6;
                    case 6: return [2 /*return*/, results];
                }
            });
        });
    };
    TornadoEventsService.prototype._parseEndpoint = function (rawEndpoint, version) {
        if (!rawEndpoint.endsWith("/")) {
            rawEndpoint = rawEndpoint.concat("/");
        }
        return "".concat(rawEndpoint).concat(version);
    };
    return TornadoEventsService;
}());
exports.TornadoEventsService = TornadoEventsService;
var delay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
