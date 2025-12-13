import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { BoardsService } from '@features/boards/services/boards.service';
import { firstValueFrom } from 'rxjs';
import { Board } from '../models/board.model';

@Injectable()
export class BoardsStore {
    public readonly boards = computed(() => this.boardsResource.value() ?? []);
    public readonly loading = computed(() => this.boardsResource.isLoading());

    private readonly boardsService = inject(BoardsService);
    private readonly projectId = signal<string | null>(null);
    private readonly boardsResource = resource({
        params: () => {
            const id = this.projectId();
            return id != null ? { id } : null;
        },
        loader: ({ params }) => firstValueFrom(this.boardsService.getByProject(params!.id)),
    });

    public setProject(projectId: string | null): void {
        this.projectId.set(projectId);
        this.boardsResource.reload();
    }

    public async create(name: string): Promise<Board | null> {
        if (!this.projectId()) return null;

        const board = await firstValueFrom(this.boardsService.create(this.projectId()!, name));
        this.boardsResource.reload();
        return board;
    }

    public async update(id: string, name: string): Promise<void> {
        await firstValueFrom(this.boardsService.update(id, name));
        this.boardsResource.reload();
    }

    public async delete(id: string): Promise<void> {
        await firstValueFrom(this.boardsService.delete(id));
        this.boardsResource.reload();
    }

    public getName(id: string): string | undefined {
        return this.boards().find((f) => f.id == id)?.name;
    }
}
