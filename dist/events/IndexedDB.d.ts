import { StoreKey, StoreNames, StoreValue } from 'idb';
export default class IndexedDB<T> {
    private database;
    private dbVersion;
    private db;
    constructor(database: string, dbVersion?: number);
    createObjectStore(tables: {
        name: StoreNames<T>;
        keyPath: string;
        indexes: string[];
        autoIncrement?: boolean;
    }[]): Promise<void>;
    getIndexCursor(tableName: StoreNames<T>, mode?: IDBTransactionMode): Promise<import("idb").IDBPCursorWithValue<T, [StoreNames<T>], StoreNames<T>, unknown, "versionchange" | "readonly" | "readwrite"> | null>;
    exists(name: StoreNames<T>): boolean;
    getValueFromIndex(tableName: StoreNames<T>, indexName: string, key: string): Promise<StoreValue<T, StoreNames<T>> | undefined>;
    getValue(tableName: StoreNames<T>, id: IDBKeyRange | StoreKey<T, StoreNames<T>>): Promise<StoreValue<T, StoreNames<T>> | undefined>;
    getAllFromIndex(tableName: StoreNames<T>, index: string, query?: IDBKeyRange): Promise<StoreValue<T, StoreNames<T>>[]>;
    getAllValues(tableName: StoreNames<T>): Promise<StoreValue<T, StoreNames<T>>[]>;
    putValue(tableName: StoreNames<T>, value: StoreValue<T, StoreNames<T>>): Promise<StoreKey<T, StoreNames<T>>>;
    putBulkValues(tableName: StoreNames<T>, values: StoreValue<T, StoreNames<T>>[]): Promise<void>;
    deleteValue(tableName: StoreNames<T>, id: IDBKeyRange | StoreKey<T, StoreNames<T>>): Promise<void>;
}
