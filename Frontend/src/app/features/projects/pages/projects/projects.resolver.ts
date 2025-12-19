import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { LoadingStore } from "@core/stores/loading.store";
import { ProjectsStore } from "@features/projects/stores/projects.store";

export const projectsResolver: ResolveFn<void> = async () => {
    const loadingStore = inject(LoadingStore);
    const projectsStore = inject(ProjectsStore);

    loadingStore.loading.set(true);

    try {
        projectsStore.reload();

        await Promise.all([
            projectsStore.loaded(),
        ]);
    } finally {
        loadingStore.loading.set(false);
    }
};