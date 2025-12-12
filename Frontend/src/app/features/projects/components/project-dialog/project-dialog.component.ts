import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Project } from "@features/projects/models/project.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "project-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
    ],
    templateUrl: "./project-dialog.component.html",
    styleUrls: ["./project-dialog.component.scss"],
})
export class ProjectDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
    private readonly data = inject<Project | null>(MAT_DIALOG_DATA);

    public readonly project = model(this.data ? { ...this.data } : new Project());

    public canConfirm(): boolean {
        return !!this.project().name;
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.dialogRef.close(this.project());
    }
}
