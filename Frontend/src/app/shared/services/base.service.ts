import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { DtoConvertibleClass } from "@shared/models/dto-model";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * BaseService extends on all services
 */
export abstract class BaseService {
    /**
     * Base URL service
     */
    protected baseUrlService: string = "";
    /**
     * Http client
     */
    protected readonly http: HttpClient = inject(HttpClient);

    /**
     * Method to get full path of an url
     * @param {string} url url to get full path
     * @returns {string} the full path url
     */
    protected getURL(url: string): string {
        return environment.apiUrl + "/" + this.baseUrlService + "/" + url;
    }

    /**
     * Executes an HTTP GET request on the specified endpoint, converts the received
     * DTO into a strongly typed model instance, and returns it as an observable.
     *
     * This method supports:
     *  - Online mode: performs the GET request and transforms the DTO response
     *    using `modelClass.fromDto()`.
     *  - Offline mode: retrieves the cached value corresponding to the generated
     *    storage key (via `fetchAndTransform()` logic).
     *
     * Internally delegates its behavior to `fetchAndTransform()` with `isList = false`.
     *
     * @template Tdto
     * The raw DTO type returned by the API.
     *
     * @template Tmodel
     * The corresponding model type produced after transformation via `fromDto()`.
     *
     * @param {DtoConvertibleClass<Tdto, Tmodel>} modelClass
     * A class implementing the static `fromDto(dto: Tdto): Tmodel` method,
     * used to convert the API response into a typed model object.
     *
     * @param {string} url
     * The API endpoint from which the DTO is retrieved.
     *
     * @param {HttpParams} [params]
     * Optional query parameters appended to the request URL.
     *
     * @returns {Observable<Tmodel | null>}
     * An observable emitting:
     *  - a `Tmodel` instance when a valid DTO is returned,
     *  - `null` when offline mode is enabled and no cached value is available.
     */
    protected httpGet<Tdto, Tmodel>(modelClass: DtoConvertibleClass<Tdto, Tmodel>, url: string, params?: HttpParams): Observable<Tmodel | null> {
        return this.fetchAndTransform<Tdto, Tmodel>(modelClass, url, false, params) as Observable<Tmodel | null>;
    }

    /**
     * Retrieves a list of items from the specified API endpoint, converts the
     * returned DTO array into an array of strongly typed model instances, and
     * returns the result as an observable.
     *
     * This method is a convenience wrapper around `fetchAndTransform()` configured
     * specifically for list-based GET requests.
     *
     * It supports:
     *  - Automatic DTO → Model conversion via `modelClass.fromDto()`
     *  - Optional query parameters
     *  - Online/offline behavior inherited from `fetchAndTransform()`
     *
     * @template Tdto
     * The raw DTO type returned by the API.
     *
     * @template Tmodel
     * The model type produced after transformation of each DTO element.
     *
     * @param {DtoConvertibleClass<Tdto, Tmodel>} modelClass
     * A class implementing the static `fromDto(dto: Tdto): Tmodel` method,
     * used to construct typed model instances.
     *
     * @param {string} url
     * The API endpoint (relative path) where the GET request is sent.
     *
     * @param {HttpParams} [params]
     * Optional query parameters to append to the request URL.
     *
     * @returns {Observable<Tmodel[]>}
     * An observable emitting the array of transformed model instances.
     * The exact behavior (online vs offline) depends on `fetchAndTransform()`.
     */
    protected httpList<Tdto, Tmodel>(modelClass: DtoConvertibleClass<Tdto, Tmodel>, url: string = "", params?: HttpParams): Observable<Tmodel[]> {
        return this.fetchAndTransform<Tdto, Tmodel>(modelClass, url, true, params) as Observable<Tmodel[]>;
    }

    /**
     * Executes an HTTP POST request to the specified endpoint, converts the returned
     * DTO into a strongly typed model instance, and returns it as an observable.
     *
     * This method supports:
     *  - Online mode: performs the POST request and transforms the DTO response
     *    using `modelClass.fromDto()`.
     *  - Offline mode: immediately resolves with `null` (POST operations are skipped).
     *
     * This method is typically used for POST endpoints that return a newly created
     * or updated resource.
     *
     * @template Tdto
     * The raw DTO type returned by the API after the POST request.
     *
     * @template Tmodel
     * The corresponding model type created after transformation via `fromDto()`.
     *
     * @param {DtoConvertibleClass<Tdto, Tmodel>} modelClass
     * A class implementing the static `fromDto(dto: Tdto): Tmodel` method,
     * used to convert the received DTO into a typed model instance.
     *
     * @param {string} url
     * The API endpoint (relative path) where the POST request is sent.
     *
     * @param {unknown} params
     * The request body for the POST operation. Typed as `unknown` by design to
     * allow callers to pass any structure required by the API.
     *
     * @returns {Observable<Tmodel>}
     * An observable emitting:
     *  - A constructed `Tmodel` instance when online.
     *  - `null` when offline mode is enabled.
     */
    protected httpPost<Tdto, Tmodel>(modelClass: DtoConvertibleClass<Tdto, Tmodel>, url: string, params: unknown): Observable<Tmodel> {
        return this.http.post<Tdto>(this.getURL(url), params).pipe(map((dto: Tdto) => modelClass.fromDto(dto)));
    }

    /**
     * Executes an HTTP POST request on the specified endpoint and returns the
     * response as a raw string without applying any DTO-to-model transformation.
     *
     * This method supports:
     *  - Online mode: sends the POST request and returns the API response
     *    interpreted as plain text.
     *  - Offline mode: immediately returns an empty string.
     *
     * The request body is optional and typed as `unknown` to allow callers to
     * provide any structure they require.
     *
     * @param {string} url
     * The API endpoint (relative path) where the POST request will be sent.
     *
     * @param {unknown} [params]
     * Optional request body to include in the POST request.
     *
     * @returns {Observable<string>}
     * An observable emitting:
     *  - the raw string returned by the server in online mode,
     *  - an empty string in offline mode.
     */
    protected httpPostString(url: string, params?: unknown): Observable<string> {
        return this.http.post(this.getURL(url), params, { responseType: "text" });
    }

    /**
     * Executes an HTTP POST request to the specified endpoint without expecting
     * any response body, and returns an observable that completes when the
     * operation is done.
     *
     * This method supports:
     *  - Online mode: sends the POST request to the API and completes once the
     *    request finishes.
     *  - Offline mode: immediately emits and completes without performing any
     *    network call.
     *
     * The request body is optional and intentionally typed as `unknown` to let
     * callers provide any structured payload.
     *
     * @param {string} url
     * The API endpoint (relative path) where the POST request will be sent.
     *
     * @param {unknown} [params]
     * Optional request body for the POST operation.
     *
     * @returns {Observable<void>}
     * An observable that completes:
     *  - immediately in offline mode,
     *  - after the POST request completes in online mode.
     */

    protected httpPostVoid(url: string, params?: unknown): Observable<void> {
        return this.http.post<void>(this.getURL(url), params);
    }

    /**
     * Sends an HTTP PUT request to the specified endpoint, converts the returned
     * DTO into a strongly typed model instance, and returns it as an observable.
     *
     * This method supports:
     *  - Online mode: performs the PUT request and transforms the returned DTO.
     *  - Offline mode: immediately resolves with `null` (PUT operations are skipped).
     *
     * @template Tdto
     * The raw DTO type returned by the API after the PUT request.
     *
     * @template Tmodel
     * The corresponding model type created after transformation via `fromDto()`.
     *
     * @param {DtoConvertibleClass<Tdto, Tmodel>} modelClass
     * A class implementing the static `fromDto(dto: Tdto): Tmodel` method,
     * used to transform the received DTO into a typed model object.
     *
     * @param {string} url
     * The API endpoint (relative path) where the PUT request is sent.
     *
     * @param {unknown} params
     * The request body to send with the PUT call. Type is `unknown` by design
     * to ensure that the caller provides a properly structured object.
     *
     * @returns {Observable<Tmodel>}
     * An observable emitting the transformed result:
     *  - A fully constructed `Tmodel` instance when online.
     *  - `null` when offline mode is enabled.
     */
    protected httpPut<Tdto, Tmodel>(modelClass: DtoConvertibleClass<Tdto, Tmodel>, url: string, params: unknown): Observable<Tmodel> {
        return this.http.put<Tdto>(this.getURL(url), params).pipe(
            map((dto) => {
                return modelClass.fromDto(dto);
            }),
        );
    }

    /**
     * Executes an HTTP DELETE request on the specified endpoint and returns
     * an observable resolving when the operation completes.
     *
     * This method supports:
     *  - Online mode: performs the DELETE request against the API.
     *  - Offline mode: immediately resolves with an empty observable.
     *
     * The DELETE request does not expect any response body.
     *
     * @param {string} url
     * The API endpoint (relative path) where the DELETE request will be sent.
     *
     * @param {HttpParams} params
     * The request params to send with the DELETE call. Type is `HttpParams` by design
     * to ensure that the caller provides a properly structured object.
     *
     * @returns {Observable<void>}
     * An observable that completes when the DELETE operation finishes:
     *  - Completes immediately in offline mode.
     *  - Completes after the HTTP DELETE call in online mode.
     */
    protected httpDelete(url: string, params?: HttpParams): Observable<void> {
        return this.http.delete<void>(this.getURL(url), { params: params });
    }

    /**
     * Retrieves data from the API (or from offline cache if enabled),
     * transforms the received DTO(s) into strongly typed model instances,
     * and returns the result as an observable.
     *
     * This method supports:
     *  - Single-object requests (isList = false)
     *  - List requests returning arrays of DTOs (isList = true)
     *  - Automatic conversion from DTO → Model via `modelClass.fromDto()`
     *  - Online mode (HTTP request + storage update)
     *  - Offline mode (reading directly from local storage)
     *
     * @template Tdto
     * The raw DTO type returned by the API.
     *
     * @template Tmodel
     * The corresponding model type created after transformation.
     *
     * @param {DtoConvertibleClass<Tdto, Tmodel>} modelClass
     * A class implementing the static `fromDto(dto: Tdto): Tmodel` method,
     * used to convert DTOs into typed model objects.
     *
     * @param {string} url
     * The API endpoint (without query parameters).
     *
     * @param {boolean} isList
     * When `true`, expects the API to return an array of DTOs and transforms
     * each one individually. When `false`, transforms a single DTO.
     *
     * @param {HttpParams} [params]
     * Optional query parameters appended to the request URL.
     *
     * @returns {Observable<Tmodel | Tmodel[] | null>}
     * An observable emitting the transformed result:
     *  - `Tmodel` for single-object requests
     *  - `Tmodel[]` for list requests
     *  - `null` if offline storage returns no cached value
     *
     * The method also updates offline storage upon successful HTTP responses.
     */
    private fetchAndTransform<Tdto, Tmodel>(
        modelClass: DtoConvertibleClass<Tdto, Tmodel>,
        url: string,
        isList: boolean,
        params?: HttpParams,
    ): Observable<Tmodel | Tmodel[] | null> {
        return this.http.get<Tdto | Tdto[]>(this.getURL(url), { params: params }).pipe(
            map((res) => {
                if (!res) {
                    return null;
                }
                let result;
                if (isList) {
                    result = (res as Tdto[]).map((dto) => {
                        return modelClass.fromDto(dto);
                    });
                } else {
                    result = modelClass.fromDto(res as Tdto);
                }

                return result;
            }),
        );
    }
}
