import { Component, inject, model } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-ask-dialog",
    imports: [TranslateModule, MatDialogModule, MatIcon, MatButton],
    templateUrl: "./ask-dialog.component.html",
})
export class AskDialogComponent {
    public readonly dialogRef = inject(MatDialogRef<AskDialogComponent>);
    public readonly data = inject<AskDialogData>(MAT_DIALOG_DATA);

    public readonly confirm = model<boolean>(true);

    public onCancelClick(): void {
        this.dialogRef.close(false);
    }
}
