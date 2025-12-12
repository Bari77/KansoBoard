import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { AskDialogComponent } from "@core/layout/dialogs/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { ProjectDialogComponent } from "@features/projects/components/project-dialog/project-dialog.component";
import { Project } from "@features/projects/models/project.model";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-projects",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, RouterLink, MatProgressSpinner],
    templateUrl: "./projects.component.html",
    styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent {
    public readonly projectsStore = inject(ProjectsStore);

    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);

    constructor() {
        this.projectsStore.reload();
    }

    public new(): void {
        const dialogRef = this.dialog.open<ProjectDialogComponent, Project, Project>(
            ProjectDialogComponent,
            { data: null }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.projectsStore.create(result.name);
                this.toastService.success("PROJECTS.CREATE_OK");
            } catch {
                this.toastService.error("PROJECTS.CREATE_KO");
            }
        });
    }

    public edit(project: Project): void {
        const dialogRef = this.dialog.open<ProjectDialogComponent, Project, Project>(
            ProjectDialogComponent,
            { data: project }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.projectsStore.update(result.id, result.name);
                this.toastService.success("PROJECTS.EDIT_OK");
            } catch {
                this.toastService.error("PROJECTS.EDIT_KO");
            }
        });
    }

    public delete(project: Project): void {
        const dialogRef = this.dialog.open<AskDialogComponent, AskDialogData, AskDialogData>(AskDialogComponent, {
            data: {
                message: "PROJECTS.DELETE_ASK",
            },
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.projectsStore.delete(project.id);
                this.toastService.success("PROJECTS.DELETE_OK");
            } catch {
                this.toastService.error("PROJECTS.DELETE_KO");
            }
        });
    }
}
