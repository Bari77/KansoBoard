import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
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
import { ToastService } from "@core/services/toast.service";
import { BoardStore } from "@features/boards/stores/board.store";
import { CardsStore } from "@features/cards/stores/cards.store";
import { ColumnDialogComponent } from "@features/columns/components/column-dialog/column-dialog.component";
import { ColumnComponent } from "@features/columns/components/column/column.component";
import { Column } from "@features/columns/models/column.model";
import { ColumnsStore } from "@features/columns/stores/columns.store";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-board",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, RouterLink, MatProgressSpinner, ColumnComponent, DragDropModule],
    templateUrl: "./board.component.html",
    styleUrls: ["./board.component.scss"],
})
export class BoardComponent {
    public readonly projectsStore = inject(ProjectsStore);
    public readonly boardStore = inject(BoardStore);
    public readonly columnsStore = inject(ColumnsStore);
    public readonly cardsStore = inject(CardsStore);

    public readonly id = computed(() => this.route.snapshot.paramMap.get("guid"));

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);

    public open(id: string): void {
        this.router.navigate(["/board", id]);
    }

    public newColumn(): void {
        const dialogRef = this.dialog.open<ColumnDialogComponent, Column, Column>(
            ColumnDialogComponent,
            { data: null }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.columnsStore.create(result.name);
                this.toastService.success("COLUMNS.CREATE_OK");
            } catch {
                this.toastService.error("COLUMNS.CREATE_KO");
            }
        });
    }

    public async dropColumn(event: CdkDragDrop<Column[]>): Promise<void> {
        if (event.previousIndex === event.currentIndex) return;

        const columns = this.columnsStore.columns();
        const dragged = columns[event.previousIndex];
        const target = columns[event.currentIndex];

        if (dragged.locked) return;
        if (target?.locked) return;

        const reordered = [...columns];
        moveItemInArray(reordered, event.previousIndex, event.currentIndex);

        await this.columnsStore.reorder(this.id()!, reordered);
    }
}
