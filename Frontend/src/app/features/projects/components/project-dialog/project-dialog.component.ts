import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ProjectCustomFieldType } from "@features/projects/models/project-custom-field-type.enum";
import { ProjectCustomField } from "@features/projects/models/project-custom-field.model";
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
        MatSelectModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
    ],
    templateUrl: "./project-dialog.component.html",
    styleUrls: ["./project-dialog.component.scss"],
})
export class ProjectDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
    private readonly data = inject<Project | null>(MAT_DIALOG_DATA);

    public readonly fieldTypes = Object.values(ProjectCustomFieldType).filter((value) => typeof value === "number") as number[];
    public readonly project = model(this.data ? this.cloneProject(this.data) : new Project());
    public readonly optionDrafts: Record<string, string> = {};

    public canConfirm(): boolean {
        return !!this.project().name
            && this.project().customFields.every((field) =>
                !!field.label?.trim()
                && (field.type !== ProjectCustomFieldType.Combo || field.allowCustomValues || field.options.length > 0)
            );
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.dialogRef.close(this.project());
    }

    public addCustomField(): void {
        this.project.update((project) => ({
            ...project,
            customFields: [
                ...project.customFields,
                new ProjectCustomField(this.generateId()),
            ],
        }));
    }

    public removeCustomField(index: number): void {
        this.project.update((project) => ({
            ...project,
            customFields: project.customFields.filter((_, i) => i !== index),
        }));
    }

    public updateFieldType(field: ProjectCustomField): void {
        if (field.type !== ProjectCustomFieldType.Combo) {
            field.allowCustomValues = false;
            field.options = [];
        }
    }

    public addOption(field: ProjectCustomField): void {
        const value = (this.optionDrafts[field.id] ?? "").trim();
        if (!value)
            return;
        if (field.options.some((option) => option.toLowerCase() === value.toLowerCase()))
            return;
        field.options = [...field.options, value];
        this.optionDrafts[field.id] = "";
    }

    public removeOption(field: ProjectCustomField, option: string): void {
        field.options = field.options.filter((value) => value !== option);
    }

    private cloneProject(project: Project): Project {
        return new Project(
            project.id,
            project.name,
            project.customFields.map((field) => new ProjectCustomField(
                field.id,
                field.label,
                field.type,
                field.allowCustomValues,
                [...field.options],
            )),
        );
    }

    private generateId(): string {
        return crypto.randomUUID();
    }
}
