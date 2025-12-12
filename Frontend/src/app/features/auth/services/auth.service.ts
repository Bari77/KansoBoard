import { Injectable, inject } from "@angular/core";
import { TokenStore } from "@features/auth/stores/token.store";
import { BaseService } from "@shared/services/base.service";
import { Observable, tap } from "rxjs";

@Injectable()
export class AuthService extends BaseService {
    protected override baseUrlService: string = "Auth";

    private readonly tokenStore = inject(TokenStore);

    public login(email: string, password: string): Observable<string> {
        return this.httpPostString("login", { email, password }).pipe(
            tap(token => this.tokenStore.save(token))
        );
    }

    public register(email: string, pseudo: string, password: string): Observable<string> {
        return this.httpPostString("register", { email, pseudo, password }).pipe(
            tap(token => this.tokenStore.save(token))
        );
    }

    public refresh(): Observable<string> {
        return this.httpPostString("refresh").pipe(
            tap(token => this.tokenStore.save(token))
        );
    }
}
