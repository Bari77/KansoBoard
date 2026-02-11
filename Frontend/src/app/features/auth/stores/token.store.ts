import { Injectable, inject, signal } from "@angular/core";
import { TokenPayloadDto } from "@features/auth/dto/token-payload.dto";
import { StorageService } from "@shared/services/storage.service";
import { jwtDecode } from "jwt-decode";

@Injectable()
export class TokenStore {
    public accessToken = signal<string | null>(null);
    public refreshToken = signal<string | null>(null);
    public tokenData = signal<TokenPayloadDto | null>(null);

    private storage = inject(StorageService);

    public async init(): Promise<void> {
        const token = await this.storage.getStorage<string>(StorageService.KANSO_TOKEN) as string;
        const refresh = await this.storage.getStorage<string>(StorageService.KANSO_REFRESH_TOKEN) as string;

        if (!token) {
            await this.clear();
            return;
        }

        this.accessToken.set(token);
        this.refreshToken.set(refresh ?? null);

        const payload = jwtDecode<TokenPayloadDto>(token);
        this.tokenData.set(payload);
    }

    public async save(accessToken: string, refreshToken?: string): Promise<void> {
        await this.storage.setStorage(StorageService.KANSO_TOKEN, accessToken);
        this.accessToken.set(accessToken);

        if (refreshToken != null) {
            await this.storage.setStorage(StorageService.KANSO_REFRESH_TOKEN, refreshToken);
            this.refreshToken.set(refreshToken);
        }

        const payload = jwtDecode<TokenPayloadDto>(accessToken);
        this.tokenData.set(payload);
    }

    public async clear(): Promise<void> {
        this.accessToken.set(null);
        this.refreshToken.set(null);
        this.tokenData.set(null);
        await this.storage.deleteStorage(StorageService.KANSO_TOKEN);
        await this.storage.deleteStorage(StorageService.KANSO_REFRESH_TOKEN);
    }
}
