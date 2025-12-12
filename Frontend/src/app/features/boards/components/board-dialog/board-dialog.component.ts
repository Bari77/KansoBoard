import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Board } from "@features/boards/models/board.model";
import { Project } from "@features/projects/models/project.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "board-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
    ],
    templateUrl: "./board-dialog.component.html",
    styleUrls: ["./board-dialog.component.scss"],
})
export class BoardDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<BoardDialogComponent>);
    private readonly data = inject<Project | null>(MAT_DIALOG_DATA);

    public readonly board = model(this.data ? { ...this.data } : new Board());

    public canConfirm(): boolean {
        return !!this.board().name;
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.dialogRef.close(this.board());
    }
}
