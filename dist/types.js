"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyAmountArray = exports.Endpoints = exports.Networks = exports.AvailableNetworks = exports.getTokenDecimals = exports.KnownCurrencies = void 0;
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
/**
 * getTokenDecimals
 *
 * Obtains the decimal numbers of a pair token
 *
 * @param chainId The note chainId
 * @param pair The note pair
 * @returns The pair token decimals
 */
var getTokenDecimals = function (chainId, pair) {
    if (!(chainId in exports.Networks)) {
        throw new Error("Chain not supported");
    }
    return config_1.default.deployments["netId".concat(chainId)][pair.currency.toLowerCase()].decimals;
};
exports.getTokenDecimals = getTokenDecimals;
var AvailableNetworks;
(function (AvailableNetworks) {
    AvailableNetworks["MAINNET"] = "mainnet";
    AvailableNetworks["GOERLI"] = "goerli";
})(AvailableNetworks = exports.AvailableNetworks || (exports.AvailableNetworks = {}));
exports.Networks = {
    1: "mainnet",
    5: "goerli",
};
exports.Endpoints = {
    mainnet: "https://mainnet-node.blockwallet.io",
    goerli: "https://goerli-node.blockwallet.io",
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
