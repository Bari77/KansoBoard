import { ClipboardModule } from "@angular/cdk/clipboard";
import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "consume-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        MatTooltipModule,
        MatChipsModule,
        ClipboardModule
    ],
    templateUrl: "./consume-dialog.component.html",
    styleUrls: ["./consume-dialog.component.scss"],
})
export class ConsumeDialogComponent {
    public readonly code = model("");

    private readonly dialogRef = inject(MatDialogRef<ConsumeDialogComponent>);

    public canConfirm(): boolean {
        return !!this.code();
    }

    public close(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.dialogRef.close(this.code());
    }
}
