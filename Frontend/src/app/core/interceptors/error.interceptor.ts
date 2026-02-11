import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CodeHttp } from "@core/enums/code-http.enum";
import { ToastService } from "@core/services/toast.service";
import { AuthStore } from "@features/auth/stores/auth.store";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    const router = inject(Router);
    const authStore = inject(AuthStore);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === CodeHttp.AUTH_ERROR || err.status === CodeHttp.UNSUPPORTED_MEDIA_TYPE) {
                return throwError(() => err);
            }

            if (err.status) {
                const backendMessage = err.error?.Message ?? err.error?.message;
                let errorMsg = "ERROR.HTTP_CODE." + err.status;
                if (typeof backendMessage === "string" && backendMessage.startsWith("ERR_")) {
                    errorMsg = "ERROR." + backendMessage;
                }

                console.error(errorMsg, err.error);
                const toastService = injector.get(ToastService);
                toastService.error(errorMsg);
            } else {
                console.error(err);
            }

            if (err.status === CodeHttp.SERVER_OFF || err.status === CodeHttp.SERVER_MAINTENANCE) {
                authStore.logout();
                router.navigateByUrl("/auth/login");
            }

            return throwError(() => err);
        }),
    );
};
