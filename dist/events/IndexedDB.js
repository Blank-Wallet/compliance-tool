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
Object.defineProperty(exports, "__esModule", { value: true });
var idb_1 = require("idb");
var IndexedDB = /** @class */ (function () {
    function IndexedDB(database, dbVersion) {
        if (dbVersion === void 0) { dbVersion = 1; }
        this.database = database;
        this.dbVersion = dbVersion;
    }
    IndexedDB.prototype.createObjectStore = function (tables) {
        return __awaiter(this, void 0, void 0, function () {
            var upgrade, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        upgrade = function (db) {
                            var _loop_1 = function (name_1, keyPath, indexes, autoIncrement) {
                                if (db.objectStoreNames.contains(name_1)) {
                                    return "continue";
                                }
                                var createdTable = db.createObjectStore(name_1, {
                                    autoIncrement: autoIncrement,
                                    keyPath: keyPath,
                                });
                                indexes.forEach(function (i) { return createdTable.createIndex(i, i); });
                            };
                            for (var _i = 0, tables_1 = tables; _i < tables_1.length; _i++) {
                                var _a = tables_1[_i], name_1 = _a.name, keyPath = _a.keyPath, indexes = _a.indexes, autoIncrement = _a.autoIncrement;
                                _loop_1(name_1, keyPath, indexes, autoIncrement);
                            }
                        };
                        _a = this;
                        return [4 /*yield*/, idb_1.openDB(this.database, this.dbVersion, {
                                upgrade: upgrade,
                            })];
                    case 1:
                        _a.db = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IndexedDB.prototype.getIndexCursor = function (tableName, mode) {
        if (mode === void 0) { mode = 'readonly'; }
        return this.db.transaction(tableName, mode).store.openCursor(null, 'prev');
    };
    IndexedDB.prototype.exists = function (name) {
        return this.db.objectStoreNames.contains(name);
    };
    IndexedDB.prototype.getValueFromIndex = function (tableName, indexName, key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.getFromIndex(tableName, indexName, key)];
            });
        });
    };
    IndexedDB.prototype.getValue = function (tableName, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.get(tableName, id)];
            });
        });
    };
    IndexedDB.prototype.getAllFromIndex = function (tableName, index, query) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.getAllFromIndex(tableName, index, query)];
            });
        });
    };
    IndexedDB.prototype.getAllValues = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.getAll(tableName)];
            });
        });
    };
    IndexedDB.prototype.putValue = function (tableName, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.put(tableName, value)];
            });
        });
    };
    IndexedDB.prototype.putBulkValues = function (tableName, values) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, store, _i, values_1, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = this.db.transaction(tableName, 'readwrite');
                        store = tx.objectStore(tableName);
                        _i = 0, values_1 = values;
                        _a.label = 1;
                    case 1:
                        if (!(_i < values_1.length)) return [3 /*break*/, 4];
                        value = values_1[_i];
                        return [4 /*yield*/, store.put(value)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IndexedDB.prototype.deleteValue = function (tableName, id) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, store, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = this.db.transaction(tableName, 'readwrite');
                        store = tx.objectStore(tableName);
                        return [4 /*yield*/, store.get(id)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw new Error('Id not found');
                        }
                        return [2 /*return*/, store.delete(id)];
                }
            });
        });
    };
    return IndexedDB;
}());
exports.default = IndexedDB;
