import { computed, inject, Injectable, resource } from "@angular/core";
import { ProjectsService } from "@features/projects/services/projects.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProjectsStore {
    public readonly projects = computed(() => this.projectsResource.value() ?? []);

    private readonly projectsService = inject(ProjectsService);
    private readonly projectsResource = resource({
        loader: () => firstValueFrom(this.projectsService.list()),
    });

    public async create(name: string): Promise<void> {
        await firstValueFrom(this.projectsService.create(name));
        this.projectsResource.reload();
    }

    public async update(id: string, name: string): Promise<void> {
        await firstValueFrom(this.projectsService.update(id, name));
        this.projectsResource.reload();
    }

    public async delete(id: string): Promise<void> {
        await firstValueFrom(this.projectsService.delete(id));
        this.projectsResource.reload();
    }

    public reload(): void {
        this.projectsResource.reload();
    }

    public getName(id: string | null | undefined): string | undefined {
        return this.projects().find((f) => f.id == id)?.name;
    }
}
