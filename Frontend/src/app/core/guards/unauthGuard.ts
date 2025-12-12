import { Injectable, computed, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { TokenStore } from "@features/auth/stores/token.store";

@Injectable({
    providedIn: "root",
})
export class UnauthGuard implements CanActivate {
    public readonly tokenData = computed(() => this.tokenStore.tokenData());
    private readonly router: Router = inject(Router);
    private readonly tokenStore: TokenStore = inject(TokenStore);

    public canActivate(): boolean {
        if (!this.tokenData()) {
            return true;
        } else {
            this.router.navigateByUrl("/home");
            return false;
        }
    }
}
