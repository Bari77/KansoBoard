import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiKeysService } from "../services/api-keys.service";

@Injectable()
export class ApiKeysStore {
    public readonly apiKey = computed(() => this.apiKeyResource.value());

    private readonly apiKeysService = inject(ApiKeysService);
    private readonly apiKeyResource = resource({
        loader: () => firstValueFrom(this.apiKeysService.get(this.projectId()!)),
    });
    private readonly projectId = signal<string | null>(null);

    public setProject(projectId: string | null): void {
        this.projectId.set(projectId);
        this.apiKeyResource.reload();
    }

    public async create(lifetime?: string): Promise<void> {
        await firstValueFrom(this.apiKeysService.create(this.projectId()!, lifetime));
        this.apiKeyResource.reload();
    }

    public async revoke(): Promise<void> {
        await firstValueFrom(this.apiKeysService.revoke(this.projectId()!, this.apiKey()!.key));
        this.apiKeyResource.reload();
    }

    public async renew(lifetime?: string): Promise<void> {
        await firstValueFrom(this.apiKeysService.revoke(this.projectId()!, this.apiKey()!.key));
        await firstValueFrom(this.apiKeysService.create(this.projectId()!, lifetime));
        this.apiKeyResource.reload();
    }

    public reload(): void {
        this.apiKeyResource.reload();
    }
}
