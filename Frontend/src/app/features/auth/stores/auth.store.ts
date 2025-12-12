import { inject, Injectable } from "@angular/core";
import { AuthService } from "@features/auth/services/auth.service";
import { TokenStore } from "@features/auth/stores/token.store";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthStore {
    private readonly authService = inject(AuthService);
    private readonly tokenStore = inject(TokenStore);

    public async login(email: string, password: string): Promise<void> {
        const token = await firstValueFrom(this.authService.login(email, password));
        await this.tokenStore.save(token);
    }

    public async register(email: string, pseudo: string, password: string): Promise<void> {
        await firstValueFrom(this.authService.register(email, pseudo, password));
    }

    public async refresh(): Promise<string> {
        const token = await firstValueFrom(this.authService.refresh());
        await this.tokenStore.save(token);
        return token;
    }

    public async logout(): Promise<void> {
        await this.tokenStore.clear();
    }
}
