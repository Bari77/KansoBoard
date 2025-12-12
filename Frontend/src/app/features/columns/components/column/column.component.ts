import { DragDropModule } from "@angular/cdk/drag-drop";
import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { AskDialogComponent } from "@core/layout/dialogs/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { ColumnDialogComponent } from "@features/columns/components/column-dialog/column-dialog.component";
import { Column } from "@features/columns/models/column.model";
import { ColumnsStore } from "@features/columns/stores/columns.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-column",
    standalone: true,
    imports: [MatCardModule, MatToolbarModule, MatButtonModule, MatGridListModule, MatIconModule, TranslateModule, MatTooltipModule, DragDropModule],
    templateUrl: "./column.component.html",
    styleUrls: ["./column.component.scss"],
})
export class ColumnComponent {
    public readonly column = input.required<Column>();
    public readonly columnsStore = inject(ColumnsStore);

    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);

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
                this.toastService.success("COLUMN.EDIT_OK");
            } catch {
                this.toastService.error("COLUMN.EDIT_KO");
            }
        });
    }

    public delete(): void {
        const dialogRef = this.dialog.open<AskDialogComponent, AskDialogData, AskDialogData>(AskDialogComponent, {
            data: {
                message: "COLUMN.DELETE_ASK",
            },
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.columnsStore.delete(this.column().id);
                this.toastService.success("COLUMN.DELETE_OK");
            } catch {
                this.toastService.error("COLUMN.DELETE_KO");
            }
        });
    }

    public addCard(): void {

    }
}
