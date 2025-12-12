import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Column } from "@features/columns/models/column.model";
import { Project } from "@features/projects/models/project.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "column-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
    ],
    templateUrl: "./column-dialog.component.html",
    styleUrls: ["./column-dialog.component.scss"],
})
export class ColumnDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<ColumnDialogComponent>);
    private readonly data = inject<Project | null>(MAT_DIALOG_DATA);

    public readonly column = model(this.data ? { ...this.data } : new Column());

    public canConfirm(): boolean {
        return !!this.column().name;
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.dialogRef.close(this.column());
    }
}
