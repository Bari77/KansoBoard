import { effect, inject, Injectable, signal } from "@angular/core";
import { GlobalLoaderOverlayDirective } from "@core/directives/loader.directive";

@Injectable()
export class LoadingStore {
    public readonly loading = signal(false);

    private readonly loader = inject(GlobalLoaderOverlayDirective);

    constructor() {
        let timeout: any;

        effect(() => {
            if (this.loading()) {
                timeout = setTimeout(() => this.loader.show(), 100);
            } else {
                clearTimeout(timeout);
                this.loader.hide();
            }
        });
    }
}