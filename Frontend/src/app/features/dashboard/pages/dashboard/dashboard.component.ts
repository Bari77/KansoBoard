import { Component, computed, inject, OnInit } from "@angular/core";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { CardPriority } from "@features/cards/enums/card-priority.enum";
import { CardType } from "@features/cards/enums/card-type.enum";
import { UserCard } from "@features/cards/models/user-card.model";
import { CardsStore } from "@features/cards/stores/cards.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "app-dashboard",
    standalone: true,
    imports: [MatCardModule, MatTabsModule, MatTableModule, MatButtonModule, MatBadgeModule, TranslateModule],
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    public readonly cardsStore = inject(CardsStore);
    private readonly router = inject(Router);

    public readonly displayedColumns: string[] = ["title", "priority", "type"];
    public readonly cardPriority = CardPriority;
    public readonly cardType = CardType;
    public readonly assignedTasksCount = computed(() => this.cardsStore.userCards().length);

    public ngOnInit(): void {
        this.cardsStore.loadUserCards();
    }

    public getPriorityLabel(priority: CardPriority): string {
        return `PRIORITIES.${priority}`;
    }

    public getTypeLabel(type: CardType): string {
        return `TYPES.${type}`;
    }

    public openCard(card: UserCard): void {
        this.router.navigate(["/boards", card.boardId, card.id]);
    }

    public onTabChange(index: number): void {
        if (index === 1) {
            this.router.navigate(["/projects"]);
        }
    }
}
