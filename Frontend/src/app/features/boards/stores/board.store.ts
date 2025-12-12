import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { BoardsService } from '@features/boards/services/boards.service';
import { delay, firstValueFrom } from 'rxjs';

@Injectable()
export class BoardStore {
    public readonly board = computed(() => this.boardResource.value());
    public readonly loading = computed(() => this.boardResource.isLoading());

    private readonly boardsService = inject(BoardsService);
    private readonly boardId = signal<string | null>(null);
    private readonly boardResource = resource({
        params: () => {
            const id = this.boardId();
            return id != null ? { id } : null;
        },
        loader: ({ params }) => firstValueFrom(this.boardsService.get(params!.id).pipe(delay(500))),
    });

    public setBoard(boardId: string | null): void {
        this.boardId.set(boardId);
        this.boardResource.reload();
    }
}
