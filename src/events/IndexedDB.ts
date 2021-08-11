import { IDBPDatabase, openDB, StoreKey, StoreNames, StoreValue } from 'idb';

export default class IndexedDB<T> {
  private db!: IDBPDatabase<T>;

  constructor(private database: string, private dbVersion: number = 1) {}

  public async createObjectStore(
    tables: {
      name: StoreNames<T>;
      keyPath: string;
      indexes: string[];
      autoIncrement?: boolean;
    }[],
  ) {
    const upgrade = (db: IDBPDatabase<T>) => {
      for (const { name, keyPath, indexes, autoIncrement } of tables) {
        if (db.objectStoreNames.contains(name)) {
          continue;
        }
        const createdTable = db.createObjectStore(name, {
          autoIncrement,
          keyPath: keyPath,
        });
        indexes.forEach((i) => createdTable.createIndex(i as any, i));
      }
    };

    this.db = await openDB<T>(this.database, this.dbVersion, {
      upgrade,
    });
  }

  public getIndexCursor(
    tableName: StoreNames<T>,
    mode: IDBTransactionMode = 'readonly',
  ) {
    return this.db.transaction(tableName, mode).store.openCursor(null, 'prev');
  }

  public exists(name: StoreNames<T>) {
    return this.db.objectStoreNames.contains(name);
  }

  public async getValueFromIndex(
    tableName: StoreNames<T>,
    indexName: string,
    key: string,
  ) {
    return this.db.getFromIndex(tableName, indexName as any, key as any);
  }

  public async getValue(
    tableName: StoreNames<T>,
    id: IDBKeyRange | StoreKey<T, StoreNames<T>>,
  ) {
    return this.db.get(tableName, id);
  }

  public async getAllFromIndex(
    tableName: StoreNames<T>,
    index: string,
    query?: IDBKeyRange,
  ) {
    return this.db.getAllFromIndex(tableName, index as any, query);
  }

  public async getAllValues(tableName: StoreNames<T>) {
    return this.db.getAll(tableName);
  }

  public async putValue(
    tableName: StoreNames<T>,
    value: StoreValue<T, StoreNames<T>>,
  ) {
    return this.db.put(tableName, value);
  }

  public async putBulkValues(
    tableName: StoreNames<T>,
    values: StoreValue<T, StoreNames<T>>[],
  ) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    for (const value of values) {
      await store.put(value);
    }
  }

  public async deleteValue(
    tableName: StoreNames<T>,
    id: IDBKeyRange | StoreKey<T, StoreNames<T>>,
  ) {
    const tx = this.db.transaction(tableName, 'readwrite');
    const store = tx.objectStore(tableName);
    const result = await store.get(id);

    if (!result) {
      throw new Error('Id not found');
    }

    return store.delete(id);
  }
}
