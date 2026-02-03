import { Injectable, inject } from "@angular/core";
import { TokenStore } from "@features/auth/stores/token.store";
import { BaseService } from "@shared/services/base.service";
import { UserDto } from "@features/users/dto/user.dto";
import { User } from "@features/users/models/user.model";
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

    public logout(): Observable<void> {
        return this.httpPostVoid("logout", {}).pipe(
            tap(() => this.tokenStore.clear())
        );
    }

    public getMe(): Observable<User | null> {
        return this.httpGet<UserDto, User>(User, "me");
    }
}
