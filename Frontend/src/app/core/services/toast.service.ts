import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastSnackComponent } from "@core/layout/snacks/components/toast-snack/toast-snack.component";
import { ToastSnackData } from "@core/models/snack-data.model";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class ToastService {
    private readonly snackBar = inject(MatSnackBar);
    private readonly translate = inject(TranslateService);

    private queue: ToastSnackData[] = [];
    private processing = false;

    public popup(
        message: string,
        action: string = "GLOBAL.CLOSE",
        color: "info" | "success" | "warn" | "danger" = "info",
        duration: number | null = 3000,
    ): void {
        this.queue.push({
            message: message,
            action: action,
            color: color,
            duration: duration,
        });

        this.processQueue();
    }

    public success(message: string, action: string = "GLOBAL.CLOSE"): void {
        this.popup(message, action, "success");
    }

    public warning(message: string, action: string = "GLOBAL.CLOSE"): void {
        this.popup(message, action, "warn");
    }

    public error(message: string, action: string = "GLOBAL.CLOSE"): void {
        this.popup(message, action, "danger", null);
    }

    private async processQueue(): Promise<void> {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const data = this.queue.shift()!;

            await this.showSnack(data);
        }

        this.processing = false;
    }

    private showSnack(data: ToastSnackData): Promise<void> {
        return new Promise((resolve) => {
            const ref = this.snackBar.openFromComponent(ToastSnackComponent, {
                data: {
                    message: this.translate.instant(data.message),
                    action: this.translate.instant(data.action),
                    duration: data.duration,
                },
                panelClass: `snack-${data.color}`,
                duration: data.duration ?? undefined,
            });

            ref.afterDismissed().subscribe(() => resolve());
        });
    }
}
