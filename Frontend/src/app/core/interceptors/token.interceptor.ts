import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CodeHttp } from "@core/enums/code-http.enum";
import { ToastService } from "@core/services/toast.service";
import { AuthService } from "@features/auth/services/auth.service";
import { TokenStore } from "@features/auth/stores/token.store";
import { catchError, ReplaySubject, switchMap, take, throwError } from "rxjs";

let isRefreshing = false;
let refreshTokenSubject = new ReplaySubject<string>(1);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    const router = inject(Router);
    const tokenStore = inject(TokenStore);
    const authService = inject(AuthService);

    const addAuthHeader = (request: HttpRequest<unknown>, token?: string) => {
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
                    catchError(() => {
                        isRefreshing = false;

                        tokenStore.clear();
                        router.navigateByUrl("/auth/login");
                        toastService.error("ERROR.ERR_RENEW_SESSION");
                        refreshTokenSubject.error("Refresh failed");
                        return throwError(() => "Refresh failed");
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
