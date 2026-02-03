import { Injectable } from "@angular/core";
import { UserDto } from "@features/users/dto/user.dto";
import { User } from "@features/users/models/user.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class UsersService extends BaseService {
    protected override baseUrlService = "Users";

    public updateMe(pseudo: string, avatarUrl?: string): Observable<User> {
        return this.httpPut<UserDto, User>(User, "me", { pseudo, avatarUrl });
    }
}
