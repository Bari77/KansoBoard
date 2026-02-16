import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CodeHttp } from "@core/enums/code-http.enum";
import { BackendErrorResponse } from "@core/models/backend-error.model";
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
            const backendError = parseBackendErrorBody(err.error);
            const hasBusinessError = backendError && backendError.Message.startsWith("ERR_");

            if (err.status) {
                const errorMsg = hasBusinessError
                    ? "ERROR." + backendError!.Message
                    : "ERROR.HTTP_CODE." + err.status;

                console.error(errorMsg, err.error);
                injector.get(ToastService).error(errorMsg);
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

function parseBackendErrorBody(body: unknown): BackendErrorResponse | null {
    if (body == null) return null;

    let data: unknown = body;
    if (typeof body === "string") {
        try {
            data = JSON.parse(body) as unknown;
        } catch {
            return null;
        }
    }

    if (typeof data !== "object" || data === null || !("Message" in data)) return null;

    const msg = (data as { Message: unknown }).Message;
    if (typeof msg !== "string") return null;

    return { Message: msg };
}
