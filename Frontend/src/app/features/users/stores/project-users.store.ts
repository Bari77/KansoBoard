import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { User } from "@features/users/models/user.model";
import { ProjectUsersService } from "@features/users/services/project-users.service";
import { PromiseUtils } from "@shared/utils/promise.utils";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProjectUsersStore {
    public readonly projectUsers = computed(() => this.projectUsersResource.value() ?? []);

    private readonly projectUsersService = inject(ProjectUsersService);
    private readonly projectId = signal<string | null>(null);
    private readonly projectUsersResource = resource({
        params: () => {
            const id = this.projectId();
            return id != null ? { id } : null;
        },
        loader: ({ params }) => firstValueFrom(this.projectUsersService.getUsers(params!.id)),
    });

    public setProject(projectId: string | null): void {
        this.projectId.set(projectId);
        this.projectUsersResource.reload();
    }

    public getUser(id: string | null | undefined): User | undefined {
        return this.projectUsers().find((f) => f.id == id);
    }

    public async loaded(): Promise<void> {
        return PromiseUtils.waitUntilFalse(() => this.projectUsersResource.isLoading());
    }
}
