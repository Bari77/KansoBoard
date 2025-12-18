import { ClipboardModule } from "@angular/cdk/clipboard";
import { Component, computed, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AskDialogComponent } from "@core/layout/dialogs/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { LoadingStore } from "@core/stores/loading.store";
import { BoardDialogComponent } from "@features/boards/components/board-dialog/board-dialog.component";
import { Board } from "@features/boards/models/board.model";
import { BoardsStore } from "@features/boards/stores/boards.store";
import { ConfigStore } from "@features/configs/store/config.store";
import { InvitationDialogComponent } from "@features/invitations/components/invitation-dialog/invitation-dialog.component";
import { InvitationsStore } from "@features/invitations/stores/invitations.store";
import { ApiKeyDialogComponent } from "@features/projects/components/api-key-dialog/api-key-dialog.component";
import { Project } from "@features/projects/models/project.model";
import { ApiKeysStore } from "@features/projects/stores/api-keys.store";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-project",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, RouterLink, ClipboardModule],
    templateUrl: "./project.component.html",
    styleUrls: ["./project.component.scss"],
})
export class ProjectComponent {
    public readonly loadingStore = inject(LoadingStore);
    public readonly projectsStore = inject(ProjectsStore);
    public readonly boardsStore = inject(BoardsStore);

    public readonly id = computed(() => this.route.snapshot.paramMap.get("guid"));
    public readonly config = computed(() => this.configStore.appConfig());
    public readonly showLoader = signal(false);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly configStore = inject(ConfigStore);
    private readonly invitationsStore = inject(InvitationsStore);
    private readonly apiKeysStore = inject(ApiKeysStore);

    constructor() {
        this.boardsStore.setProject(this.id());
        this.apiKeysStore.setProject(this.id());
    }

    public new(): void {
        const dialogRef = this.dialog.open<BoardDialogComponent, Project, Project>(
            BoardDialogComponent,
            { data: null }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                const board = await this.boardsStore.create(result.name);
                this.toastService.success("BOARDS.CREATE_OK");
                this.router.navigate(["/boards", board?.id]);
            } catch {
                this.toastService.error("BOARDS.CREATE_KO");
            }
        });
    }

    public edit(board: Board): void {
        const dialogRef = this.dialog.open<BoardDialogComponent, Project, Project>(
            BoardDialogComponent,
            { data: board }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.boardsStore.update(result.id, result.name);
                this.toastService.success("BOARDS.EDIT_OK");
            } catch {
                this.toastService.error("BOARDS.EDIT_KO");
            }
        });
    }

    public delete(project: Project): void {
        const dialogRef = this.dialog.open<AskDialogComponent, AskDialogData, AskDialogData>(AskDialogComponent, {
            data: {
                message: "BOARDS.DELETE_ASK",
            },
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.boardsStore.delete(project.id);
                this.toastService.success("BOARDS.DELETE_OK");
            } catch {
                this.toastService.error("BOARDS.DELETE_KO");
            }
        });
    }

    public async getInvitation(): Promise<void> {
        this.dialog.open<InvitationDialogComponent, string, string>(InvitationDialogComponent, {
            data: await this.invitationsStore.create(this.id()!),
            width: "400px",
        });
    }

    public async apiKey(): Promise<void> {
        this.dialog.open<ApiKeyDialogComponent, string, string>(ApiKeyDialogComponent);
    }
}
