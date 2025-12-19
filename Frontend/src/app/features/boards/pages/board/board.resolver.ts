import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { LoadingStore } from "@core/stores/loading.store";
import { BoardStore } from "@features/boards/stores/board.store";
import { CardsStore } from "@features/cards/stores/cards.store";
import { ColumnsStore } from "@features/columns/stores/columns.store";

export const boardResolver: ResolveFn<void> = async (route) => {
    const loadingStore = inject(LoadingStore);
    const boardStore = inject(BoardStore);
    const columnsStore = inject(ColumnsStore);
    const cardsStore = inject(CardsStore);

    const boardId = route.paramMap.get('guid');

    loadingStore.loading.set(true);

    try {
        boardStore.setBoard(boardId);
        columnsStore.setBoard(boardId);
        cardsStore.setBoard(boardId);

        await Promise.all([
            boardStore.loaded(),
            columnsStore.loaded(),
            cardsStore.loaded(),
        ]);
    } finally {
        loadingStore.loading.set(false);
    }
};