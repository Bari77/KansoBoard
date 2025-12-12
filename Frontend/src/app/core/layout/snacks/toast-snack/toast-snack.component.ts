import { Component, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";
import { ToastSnackData } from "@core/models/snack-data.model";

@Component({
    selector: "app-toast-snack",
    standalone: true,
    imports: [MatProgressBarModule, MatButtonModule],
    templateUrl: "./toast-snack.component.html",
    styleUrls: ["./toast-snack.component.scss"],
})
export class ToastSnackComponent implements OnInit, OnDestroy {
    public readonly snackRef = inject(MatSnackBarRef<ToastSnackComponent>);
    public readonly data = inject<ToastSnackData>(MAT_SNACK_BAR_DATA);

    public readonly progress = signal(0);

    private intervalId: any;
    private startTime = 0;

    public ngOnInit(): void {
        if (!this.data.duration) {
            return;
        }

        this.startTime = Date.now();
        const total = this.data.duration;

        this.intervalId = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const value = Math.min(100, (elapsed / total) * 100);
            this.progress.set(value);

            if (value >= 100) {
                clearInterval(this.intervalId);
            }
        }, 50);
    }

    public ngOnDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    public onActionClick(): void {
        this.snackRef.dismiss();
    }
}
