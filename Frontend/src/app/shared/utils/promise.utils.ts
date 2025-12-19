import { effect } from "@angular/core";

export class PromiseUtils {
    public static waitUntilFalse(signal: () => boolean): Promise<void> {
        return new Promise((resolve) => {
            const ref = effect(() => {
                if (!signal()) {
                    ref.destroy();
                    resolve();
                }
            });
        });
    }
}