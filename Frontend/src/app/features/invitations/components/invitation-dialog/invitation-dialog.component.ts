import { ClipboardModule } from "@angular/cdk/clipboard";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "invitation-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        MatIcon,
        MatTooltipModule,
        MatChipsModule,
        ClipboardModule
    ],
    templateUrl: "./invitation-dialog.component.html",
    styleUrls: ["./invitation-dialog.component.scss"],
})
export class InvitationDialogComponent {
    public readonly data = inject<string>(MAT_DIALOG_DATA);

    private readonly dialogRef = inject(MatDialogRef<InvitationDialogComponent>);

    public close(): void {
        this.dialogRef.close();
    }
}
