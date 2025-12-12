import { Injectable, inject, signal } from "@angular/core";
import { TokenPayloadDto } from "@features/auth/dto/token-payload.dto";
import { StorageService } from "@shared/services/storage.service";
import { jwtDecode } from "jwt-decode";

@Injectable()
export class TokenStore {
    public accessToken = signal<string | null>(null);
    public tokenData = signal<TokenPayloadDto | null>(null);

    private storage = inject(StorageService);

    public async init(): Promise<void> {
        const token = await this.storage.getStorage<string>(StorageService.KANSO_TOKEN) as string;
        if (!token) {
            await this.clear();
            return;
        }

        this.accessToken.set(token);

        const payload = jwtDecode<TokenPayloadDto>(token);

        this.tokenData.set(payload);
    }

    public async save(token: string): Promise<void> {
        await this.storage.setStorage(StorageService.KANSO_TOKEN, token);
        this.accessToken.set(token);

        const payload = jwtDecode<TokenPayloadDto>(token);

        this.tokenData.set(payload);
    }

    public async clear(): Promise<void> {
        this.accessToken.set(null);
        this.tokenData.set(null);
        await this.storage.deleteStorage(StorageService.KANSO_TOKEN);
    }
}
