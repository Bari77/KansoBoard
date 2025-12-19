import { Component, computed, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AskDialogComponent } from "@core/layout/dialogs/components/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { CardPriority } from "@features/cards/enums/card-priority.enum";
import { CardType } from "@features/cards/enums/card-type.enum";
import { Card } from "@features/cards/models/card.model";
import { CardsStore } from "@features/cards/stores/cards.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "card-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
    ],
    templateUrl: "./card-dialog.component.html",
    styleUrls: ["./card-dialog.component.scss"],
})
export class CardDialogComponent {
    public readonly data = inject<Card | null>(MAT_DIALOG_DATA);
    public readonly card = model(this.data ? { ...this.data } : new Card());
    public readonly types = computed(() => Object.values(CardType).filter(v => typeof v === 'number'));
    public readonly priorities = computed(() => Object.values(CardPriority).filter(v => typeof v === 'number'));

    private readonly dialogRef = inject(MatDialogRef<CardDialogComponent>);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly cardsStore = inject(CardsStore);

    public canConfirm(): boolean {
        return !!this.card().title
            && this.card().type !== null
            && this.card().priority !== null;
    }

    public close(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.dialogRef.close(this.card());
    }

    public async delete(): Promise<void> {
        const dialogRef = this.dialog.open<AskDialogComponent, AskDialogData, AskDialogData>(AskDialogComponent, {
            data: {
                message: "CARDS.DELETE_ASK",
            },
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.cardsStore.delete(this.card().id);
                this.toastService.success("CARDS.DELETE_OK");
                this.close();
            } catch {
                this.toastService.error("CARDS.DELETE_KO");
            }
        });
    }
}
