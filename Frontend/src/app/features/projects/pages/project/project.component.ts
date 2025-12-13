import { ClipboardModule } from "@angular/cdk/clipboard";
import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AskDialogComponent } from "@core/layout/dialogs/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { BoardDialogComponent } from "@features/boards/components/board-dialog/board-dialog.component";
import { Board } from "@features/boards/models/board.model";
import { BoardsStore } from "@features/boards/stores/boards.store";
import { ConfigStore } from "@features/configs/store/config.store";
import { Project } from "@features/projects/models/project.model";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-project",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, RouterLink, MatProgressSpinner, ClipboardModule],
    templateUrl: "./project.component.html",
    styleUrls: ["./project.component.scss"],
})
export class ProjectComponent {
    public readonly projectsStore = inject(ProjectsStore);
    public readonly boardsStore = inject(BoardsStore);

    public readonly id = computed(() => this.route.snapshot.paramMap.get("guid"));
    public readonly config = computed(() => this.configStore.appConfig());

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly configStore = inject(ConfigStore);

    constructor() {
        this.boardsStore.setProject(this.id());
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
}
