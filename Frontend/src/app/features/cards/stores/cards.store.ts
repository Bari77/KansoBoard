import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { Card } from "@features/cards/models/card.model";
import { CardsService } from "@features/cards/services/cards.service";
import { PromiseUtils } from "@shared/utils/promise.utils";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CardsStore {
    public readonly cards = computed(() => this.cardsResource.value() ?? []);

    private readonly cardsService = inject(CardsService);
    private readonly boardId = signal<string | null>(null);

    private readonly cardsResource = resource({
        params: () => {
            const id = this.boardId();
            return id != null ? { id } : null;
        },
        loader: ({ params }) => firstValueFrom(this.cardsService.getByBoard(params!.id)),
    });

    public setBoard(boardId: string | null) {
        this.boardId.set(boardId);
        this.cardsResource.reload();
    }

    public async create(
        columnId: string,
        title: string,
        description: string | null,
        type: number,
        priority: number,
    ) {
        await firstValueFrom(this.cardsService.create(columnId, title, description, type, priority));
        this.cardsResource.reload();
    }

    public async update(
        id: string,
        title: string,
        description: string | null,
        type: number,
        priority: number,
    ) {
        await firstValueFrom(
            this.cardsService.update(
                id,
                title,
                description,
                type,
                priority,
            )
        );
        this.cardsResource.reload();
    }

    public async delete(id: string) {
        await firstValueFrom(this.cardsService.delete(id));
        this.cardsResource.reload();
    }

    public async assign(id: string, userId: string | null) {
        await firstValueFrom(this.cardsService.assign(id, userId));
        this.cardsResource.reload();
    }

    public async move(id: string, newColumnId: string) {
        await firstValueFrom(this.cardsService.move(id, newColumnId));
        this.cardsResource.reload();
    }

    public async reorder(columnId: string, reordered: Card[]) {
        if (reordered.length === 0) return;

        const payload = reordered.map((card, index) => ({
            id: card.id,
            order: index + 1,
        }));

        await firstValueFrom(
            this.cardsService.reorder(columnId, payload)
        );

        this.cardsResource.reload();
    }

    public async transfer(id: string, boardId: string) {
        await firstValueFrom(this.cardsService.transfer(id, boardId));
        this.cardsResource.reload();
    }

    public getByColumn(columnId: string): Card[] {
        return this.cards().filter(c => c.columnId === columnId);
    }

    public async loaded(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.cardsResource.isLoading());
    }
}
