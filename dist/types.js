"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyAmountArray = exports.Networks = exports.AvailableNetworks = exports.KnownCurrencies = void 0;
var config_1 = __importDefault(require("./config"));
var instances = config_1.default.deployments.netId1;
var KnownCurrencies;
(function (KnownCurrencies) {
    KnownCurrencies["ETH"] = "eth";
    KnownCurrencies["DAI"] = "dai";
    KnownCurrencies["cDAI"] = "cdai";
    KnownCurrencies["USDC"] = "usdc";
    KnownCurrencies["USDT"] = "usdt";
    KnownCurrencies["WBTC"] = "wbtc";
})(KnownCurrencies = exports.KnownCurrencies || (exports.KnownCurrencies = {}));
;
var AvailableNetworks;
(function (AvailableNetworks) {
    AvailableNetworks["MAINNET"] = "mainnet";
    AvailableNetworks["GOERLI"] = "goerli";
})(AvailableNetworks = exports.AvailableNetworks || (exports.AvailableNetworks = {}));
exports.Networks = {
    1: 'mainnet',
    5: 'goerli'
};
/**
 * CurrencyAmountArray
 */
exports.CurrencyAmountArray = Object.keys(instances).reduce(function (pv, cv) {
    var currency = cv;
    if (Object.values(KnownCurrencies).includes(currency)) {
        pv[currency] = Object.keys(instances[currency].instanceAddress).sort();
    }
    return pv;
}, {});
