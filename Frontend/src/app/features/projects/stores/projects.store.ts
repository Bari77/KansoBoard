import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { Project } from "@features/projects/models/project.model";
import { ProjectsService } from "@features/projects/services/projects.service";
import { PromiseUtils } from "@shared/utils/promise.utils";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProjectsStore {
    public readonly projects = computed(() => this.projectsResource.value() ?? []);
    public readonly currentProject = computed(() => this.currentProjectResource.value() ?? null);

    private readonly projectsService = inject(ProjectsService);
    private readonly currentProjectId = signal<string | null>(null);
    private readonly projectsResource = resource({
        loader: () => firstValueFrom(this.projectsService.list()),
    });
    private readonly currentProjectResource = resource({
        params: () => {
            const id = this.currentProjectId();
            return id != null ? { id } : null;
        },
        loader: ({ params }) => firstValueFrom(this.projectsService.get(params!.id)),
    });

    public async create(name: string, customFields: Project["customFields"]): Promise<void> {
        await firstValueFrom(this.projectsService.create(name, customFields));
        this.projectsResource.reload();
    }

    public async update(id: string, name: string, customFields: Project["customFields"]): Promise<void> {
        await firstValueFrom(this.projectsService.update(id, name, customFields));
        this.projectsResource.reload();
        if (this.currentProjectId() === id)
            this.currentProjectResource.reload();
    }

    public async delete(id: string): Promise<void> {
        await firstValueFrom(this.projectsService.delete(id));
        this.projectsResource.reload();
    }

    public reload(): void {
        this.projectsResource.reload();
    }

    public setCurrentProject(projectId: string | null): void {
        this.currentProjectId.set(projectId);
        this.currentProjectResource.reload();
    }

    public getName(id: string | null | undefined): string | undefined {
        return this.projects().find((f) => f.id == id)?.name;
    }

    public async loaded(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.projectsResource.isLoading());
    }

    public async loadedCurrentProject(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.currentProjectResource.isLoading());
    }
}
