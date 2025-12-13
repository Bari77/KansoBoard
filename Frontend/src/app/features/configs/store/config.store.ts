import { Injectable, inject, signal } from "@angular/core";
import { AppConfig } from "@features/configs/models/app-config.model";
import { StorageService } from "@shared/services/storage.service";

@Injectable()
export class ConfigStore {
    public appConfig = signal<AppConfig>(null!);

    private readonly storage: StorageService = inject(StorageService);

    public async initApp(): Promise<void> {
        const config = (await this.storage.getStorage<AppConfig>(StorageService.KANSO_DATA, AppConfig)) as AppConfig;

        if (config) {
            this.appConfig.set(config);
            return;
        }

        this.appConfig.set(new AppConfig());

        this.storage.setStorage(StorageService.KANSO_DATA, this.appConfig());
    }

    public async setConfig(config: AppConfig): Promise<void> {
        await this.storage.setStorage<AppConfig>(StorageService.KANSO_DATA, config);
        this.appConfig.set(config);
    }
}
