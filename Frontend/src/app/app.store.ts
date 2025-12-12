import { Injectable, computed, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppStore {
    public readonly loading = computed(() => this.$loading());

    private readonly $loading = signal(true);

    public setLoading(value: boolean): void {
        this.$loading.set(value);
    }
}
