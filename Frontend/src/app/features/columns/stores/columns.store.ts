import { computed, inject, resource, signal } from "@angular/core";
import { delay, firstValueFrom } from "rxjs";
import { Column } from "../models/column.model";
import { ColumnsService } from "../services/columns.service";

export class ColumnsStore {
    public readonly columns = computed(() => this.columnsResource.value() ?? []);
    public readonly loading = computed(() => this.columnsResource.isLoading());

    private readonly columnsService = inject(ColumnsService);
    private readonly boardId = signal<string | null>(null);
    private readonly columnsResource = resource({
        params: () => {
            const id = this.boardId();
            return id != null ? { id } : null;
        },
        loader: ({ params }) => firstValueFrom(this.columnsService.getByBoard(params!.id).pipe(delay(500))),
    });

    public setBoard(boardId: string | null) {
        this.boardId.set(boardId);
        this.columnsResource.reload();
    }

    public async create(name: string) {
        await firstValueFrom(this.columnsService.create(this.boardId()!, name));
        this.columnsResource.reload();
    }

    public async update(id: string, name: string): Promise<void> {
        await firstValueFrom(this.columnsService.update(id, name));
        this.columnsResource.reload();
    }

    public async reorder(boardId: string, reordered: Column[]) {
        if (reordered.length === 0) return;

        const payload = reordered.map((column, index) => ({
            id: column.id,
            order: index + 1,
        }));

        await firstValueFrom(
            this.columnsService.reorder(boardId, payload)
        );

        this.columnsResource.reload();
    }

    public async delete(id: string) {
        await firstValueFrom(this.columnsService.delete(id));
        this.columnsResource.reload();
    }
}
