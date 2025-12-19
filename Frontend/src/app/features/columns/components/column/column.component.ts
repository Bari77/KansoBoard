import { ClipboardModule } from "@angular/cdk/clipboard";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, computed, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { AskDialogComponent } from "@core/layout/dialogs/components/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { CardDialogComponent } from "@features/cards/components/card-dialog/card-dialog.component";
import { CardComponent } from "@features/cards/components/card/card.component";
import { Card } from "@features/cards/models/card.model";
import { CardsStore } from "@features/cards/stores/cards.store";
import { ColumnDialogComponent } from "@features/columns/components/column-dialog/column-dialog.component";
import { Column } from "@features/columns/models/column.model";
import { ColumnsStore } from "@features/columns/stores/columns.store";
import { ConfigStore } from "@features/configs/store/config.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-column",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, DragDropModule, CardComponent, ClipboardModule],
    templateUrl: "./column.component.html",
    styleUrls: ["./column.component.scss"],
})
export class ColumnComponent {
    public readonly column = input.required<Column>();
    public readonly connectedColumns = computed(() => this.columnsStore.columns().map(c => c.id));
    public readonly cards = computed(() => this.cardsStore.getByColumn(this.column().id));
    public readonly dropListId = computed(() => this.column().id);
    public readonly config = computed(() => this.configStore.appConfig());
    public readonly columnsStore = inject(ColumnsStore);
    public readonly cardsStore = inject(CardsStore);

    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly configStore = inject(ConfigStore);

    public open(id: string): void {
        this.router.navigate(["/board", id]);
    }

    public edit(): void {
        const dialogRef = this.dialog.open<ColumnDialogComponent, Column, Column>(
            ColumnDialogComponent,
            { data: this.column() }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.columnsStore.update(result.id, result.name);
                this.toastService.success("COLUMNS.EDIT_OK");
            } catch {
                this.toastService.error("COLUMNS.EDIT_KO");
            }
        });
    }

    public delete(): void {
        const dialogRef = this.dialog.open<AskDialogComponent, AskDialogData, AskDialogData>(AskDialogComponent, {
            data: {
                message: "COLUMNS.DELETE_ASK",
            },
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.columnsStore.delete(this.column().id);
                this.toastService.success("COLUMNS.DELETE_OK");
            } catch {
                this.toastService.error("COLUMNS.DELETE_KO");
            }
        });
    }

    public addCard(): void {
        const dialogRef = this.dialog.open<CardDialogComponent, Card, Card>(
            CardDialogComponent,
            { data: null }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.cardsStore.create(this.column().id, result.title, result.description, result.type, result.priority);
                this.toastService.success("CARDS.CREATE_OK");
            } catch {
                this.toastService.error("CARDS.CREATE_KO");
            }
        });
    }

    public async dropCard(event: CdkDragDrop<Card[]>) {
        const card = event.item.data as Card;

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

            await this.cardsStore.reorder(this.column().id, event.container.data);
            return;
        }

        transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
        );

        await this.cardsStore.move(card.id, this.column().id);
    }
}
