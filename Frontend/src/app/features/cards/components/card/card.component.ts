import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '@core/services/toast.service';
import { CardPriority } from '@features/cards/enums/card-priority.enum';
import { CardType } from '@features/cards/enums/card-type.enum';
import { Card } from '@features/cards/models/card.model';
import { CardsStore } from '@features/cards/stores/cards.store';
import { CardDialogComponent } from '../card-dialog/card-dialog.component';

@Component({
    selector: "app-card",
    standalone: true,
    imports: [MatCardModule, MatTooltipModule, DragDropModule],
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"],
})
export class CardComponent {
    public readonly card = input.required<Card>();

    public readonly cardType = CardType;
    public readonly cardPriority = CardPriority;

    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly cardsStore = inject(CardsStore);

    public edit(): void {
        const dialogRef = this.dialog.open<CardDialogComponent, Card, Card>(
            CardDialogComponent,
            { data: this.card() }
        );

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.cardsStore.update(result.id, result.title, result.description, result.type, result.priority);
                this.toastService.success("CARDS.EDIT_OK");
            } catch {
                this.toastService.error("CARDS.EDIT_KO");
            }
        });
    }
}
