import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterLink } from "@angular/router";
import { AskDialogComponent } from "@core/layout/dialogs/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { ConfigStore } from '@features/configs/store/config.store';
import { ConsumeDialogComponent } from '@features/invitations/components/consume-dialog/consume-dialog.component';
import { InvitationsStore } from '@features/invitations/stores/invitations.store';
import { ProjectDialogComponent } from "@features/projects/components/project-dialog/project-dialog.component";
import { Project } from "@features/projects/models/project.model";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-projects",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, RouterLink, ClipboardModule],
    templateUrl: "./projects.component.html",
    styleUrls: ["./projects.component.scss"],
})
export class ProjectsComponent {
    public readonly projectsStore = inject(ProjectsStore);
    public readonly config = computed(() => this.configStore.appConfig());

    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly configStore = inject(ConfigStore);
    private readonly invitationStore = inject(InvitationsStore);

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

    public join(): void {
        const dialogRef = this.dialog.open<ConsumeDialogComponent, null, string>(ConsumeDialogComponent, {
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                const consumeResult = await this.invitationStore.consume(result);
                if (consumeResult.alreadyMember) {
                    this.toastService.warning("PROJECTS.ALREADY_JOIN");
                    this.router.navigate(["/projects", consumeResult.projectId]);
                    return;
                }
                this.toastService.success("PROJECTS.JOIN_OK");
                this.projectsStore.reload();
                this.router.navigate(["/projects", consumeResult.projectId]);
            } catch {
                this.toastService.error("PROJECTS.JOIN_KO");
            }
        });
    }
}
