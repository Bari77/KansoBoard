import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { LoadingStore } from "@core/stores/loading.store";
import { BoardsStore } from "@features/boards/stores/boards.store";
import { ApiKeysStore } from "@features/projects/stores/api-keys.store";

export const projectResolver: ResolveFn<void> = async (route) => {
    const loadingStore = inject(LoadingStore);
    const boardsStore = inject(BoardsStore);
    const apiKeysStore = inject(ApiKeysStore);

    const projectId = route.paramMap.get('guid');

    loadingStore.loading.set(true);

    try {
        boardsStore.setProject(projectId);
        apiKeysStore.setProject(projectId);

        await Promise.all([
            boardsStore.loaded(),
            apiKeysStore.loaded(),
        ]);
    } finally {
        loadingStore.loading.set(false);
    }
};