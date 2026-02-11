import { Injectable, inject } from "@angular/core";
import { AuthTokensDto } from "@features/auth/dto/auth-tokens.dto";
import { AuthTokens } from "@features/auth/models/auth-tokens.model";
import { TokenStore } from "@features/auth/stores/token.store";
import { BaseService } from "@shared/services/base.service";
import { UserDto } from "@features/users/dto/user.dto";
import { User } from "@features/users/models/user.model";
import { Observable, tap, map, throwError } from "rxjs";

@Injectable()
export class AuthService extends BaseService {
    protected override baseUrlService: string = "Auth";

    private readonly tokenStore = inject(TokenStore);

    public login(email: string, password: string): Observable<void> {
        return this.httpPost<AuthTokensDto, AuthTokens>(AuthTokens, "login", { email, password }).pipe(
            tap((res) => this.tokenStore.save(res.accessToken, res.refreshToken)),
            map(() => undefined)
        );
    }

    public register(email: string, pseudo: string, password: string): Observable<string> {
        return this.httpPostString("register", { email, pseudo, password });
    }

    public refresh(): Observable<string> {
        const refreshToken = this.tokenStore.refreshToken();
        if (!refreshToken) {
            return throwError(() => new Error("No refresh token"));
        }
        return this.httpPost<AuthTokensDto, AuthTokens>(AuthTokens, "refresh", { refreshToken }).pipe(
            tap((res) => this.tokenStore.save(res.accessToken, res.refreshToken)),
            map((res) => res.accessToken)
        );
    }

    public logout(): Observable<void> {
        return this.httpPostVoid("logout", {}).pipe(
            tap(() => this.tokenStore.clear())
        );
    }

    public getMe(): Observable<User | null> {
        return this.httpGet<UserDto, User>(User, "me");
    }
}
