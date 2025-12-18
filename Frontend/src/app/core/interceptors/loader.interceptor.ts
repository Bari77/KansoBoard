import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoadingStore } from "@core/stores/loading.store";
import { finalize } from "rxjs";

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loader = inject(LoadingStore);
    loader.loading.set(true);

    return next(req).pipe(
        finalize(() => loader.loading.set(false))
    );
};
