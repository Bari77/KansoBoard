import { Injectable } from "@angular/core";
import { DtoConvertibleClass } from "@shared/models/dto-model";

@Injectable()
export class StorageService {
    public static readonly KANSO_TOKEN: string = "Kanso_Token";
    public static readonly KANSO_REFRESH_TOKEN: string = "Kanso_Refresh_Token";
    public static readonly KANSO_DATA: string = "Kanso_Data";

    /**
     * Retrieves a value from offline storage (using Capacitor Preferences),
     * converts the stored JSON into one or multiple model instances, and returns
     * the result as a Promise.
     *
     * This method supports:
     *  - Single-object storage: converts a single DTO into a `Tmodel` instance.
     *  - List storage: converts an array of DTOs into an array of `Tmodel`.
     *  - Empty or missing storage: returns `null`.
     *
     * The method assumes that values stored under the provided key are JSON
     * strings previously written using `setStorage()` or similar methods.
     *
     * @template Tdto
     * The raw DTO type that was previously stored.
     *
     * @template Tmodel
     * The model type produced after transformation via `fromDto()`.
     *
     * @param {string} key
     * The unique identifier used to retrieve the stored data.
     *
     * @param {DtoConvertibleClass<Tdto, Tmodel>} modelClass
     * A class implementing the static `fromDto(dto: Tdto): Tmodel` method,
     * used to convert raw DTO objects into typed model instances.
     *
     * @returns {Promise<Tmodel | Tmodel[] | null>}
     * A promise resolving to:
     *  - a `Tmodel` instance if a single DTO was stored,
     *  - an array of `Tmodel` if a list was stored,
     *  - `null` if no stored value exists for the given key.
     */
    public async getDataStorage<Tdto, Tmodel>(key: string, modelClass: DtoConvertibleClass<Tdto, Tmodel>): Promise<Tmodel | Tmodel[] | null> {
        const value = localStorage.getItem(key);
        if (!value) return null;

        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
            return parsed.map((o) => modelClass.fromDto(o));
        }

        return modelClass.fromDto(parsed);
    }

    /**
     * Retrieves a value from offline storage (via Capacitor Preferences), optionally
     * instantiates it using a provided class constructor, and returns the result as
     * a Promise.
     *
     * This method supports:
     *  - Returning raw parsed JSON when no constructor is provided.
     *  - Instantiating a single object when `type` is passed.
     *  - Instantiating multiple objects when the stored value is an array.
     *  - Returning `null` when no value exists for the given key.
     *
     * Unlike `getDataStorage()`, this method does not rely on a `fromDto()` method
     * and directly constructs objects using the provided class constructor.
     *
     * @template T
     * The expected type of the stored value or the instantiated object(s).
     *
     * @param {string} key
     * The storage key used to retrieve the saved JSON value.
     *
     * @param {(new (o: T) => T)} [type]
     * Optional constructor used to instantiate model objects from the stored data.
     * If omitted, the method returns the raw parsed JSON structure (`T` or `T[]`).
     *
     * @returns {Promise<T | T[] | null>}
     * A promise resolving to:
     *  - a single instantiated object when stored data is an object and `type` is provided,
     *  - an array of instantiated objects when stored data is an array and `type` is provided,
     *  - the raw parsed JSON value when `type` is omitted,
     *  - `null` if the key does not exist or has no stored value.
     */
    public async getStorage<T>(key: string, type?: new (o: T) => T): Promise<T | T[] | null> {
        const value = localStorage.getItem(key);
        if (!value) return null;

        const parsed = JSON.parse(value);

        if (!type) {
            return parsed;
        }

        if (Array.isArray(parsed)) {
            return parsed.map((o) => new type(o));
        }

        return new type(parsed);
    }

    /**
     * Stores a value in offline storage (via Capacitor Preferences), optionally
     * converting it to JSON if it is not already a string.
     *
     * This method supports:
     *  - Storing a single object when `data` is not `null`.
     *  - Deleting the key when `data` is `null`.
     *
     * @template T
     * The type of the data to store.
     * 
     * @param key The storage key used to store the data.
     * @param data The data to store.
     * @returns {Promise<void>} A promise that resolves when the data is stored.
     */
    public async setStorage<T>(key: string, data: T | null): Promise<void> {
        if (data) {
            localStorage.setItem(key, JSON.stringify(data));
        } else {
            await this.deleteStorage(key);
        }
    }

    /**
     * Deletes a value from offline storage (via Capacitor Preferences).
     *
     * This method supports:
     *  - Deleting a single key when `key` is provided.
     *  - Deleting all keys when `key` is `null`.
     *
     * @param key The storage key used to delete the data.
     * @returns {Promise<void>} A promise that resolves when the data is deleted.
     */
    public async deleteStorage(key: string): Promise<void> {
        localStorage.removeItem(key);
    }
}
