import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CodeHttp } from "@core/enums/code-http.enum";
import { ToastService } from "@core/services/toast.service";
import { LoadingStore } from "@core/stores/loading.store";
import { AuthService } from "@features/auth/services/auth.service";
import { TokenStore } from "@features/auth/stores/token.store";
import { catchError, from, ReplaySubject, switchMap, take, throwError } from "rxjs";

function getRefreshErrorKey(err: unknown): string {
    if (err && typeof err === "object" && "error" in err) {
        const body = (err as HttpErrorResponse).error;
        const msg =
            typeof body === "object" && body !== null && "Message" in body
                ? (body as { Message: unknown }).Message
                : null;
        if (typeof msg === "string" && msg.startsWith("ERR_")) return "ERROR." + msg;
    }
    return "ERROR.ERR_RENEW_SESSION";
}

let isRefreshing = false;
let refreshTokenSubject = new ReplaySubject<string>(1);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    const router = inject(Router);
    const tokenStore = inject(TokenStore);
    const authService = inject(AuthService);
    const loadingStore = inject(LoadingStore);

    const isRefreshRequest = (request: HttpRequest<unknown>) =>
        request.url.includes("/Auth/refresh");

    const addAuthHeader = (request: HttpRequest<unknown>, token?: string) => {
        if (isRefreshRequest(request)) return request;
        const jwt = token ?? tokenStore.accessToken();
        if (!jwt) return request;

        return request.clone({
            setHeaders: { Authorization: `Bearer ${jwt}` }
        });
    };

    return next(addAuthHeader(req)).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status !== CodeHttp.AUTH_ERROR) {
                return throwError(() => err);
            }

            const toastService = injector.get(ToastService);
            if (!isRefreshing) {
                isRefreshing = true;
                refreshTokenSubject = new ReplaySubject<string>(1);

                return authService.refresh().pipe(
                    switchMap((newToken: string) => {
                        isRefreshing = false;

                        if (!newToken) {
                            tokenStore.clear();
                            router.navigateByUrl("/auth/login");
                            toastService.error("ERROR.ERR_EXPIRED_SESSION");
                            return throwError(() => "No token provided by refresh");
                        }

                        refreshTokenSubject.next(newToken);
                        const cloned = addAuthHeader(req, newToken);
                        return next(cloned);
                    }),
                    catchError((refreshErr: unknown) => {
                        isRefreshing = false;
                        loadingStore.loading.set(false);

                        toastService.error(getRefreshErrorKey(refreshErr));
                        refreshTokenSubject.error("Refresh failed");

                        return from(tokenStore.clear()).pipe(
                            switchMap(() => {
                                router.navigateByUrl("/auth/login");
                                return throwError(() => refreshErr);
                            })
                        );
                    })
                );
            }

            return refreshTokenSubject.pipe(
                take(1),
                switchMap((token) => next(addAuthHeader(req, token)))
            );
        })
    );
};
