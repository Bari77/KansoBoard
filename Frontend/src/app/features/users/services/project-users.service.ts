import { Injectable } from "@angular/core";
import { UserDto } from "@features/users/dto/user.dto";
import { User } from "@features/users/models/user.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class ProjectUsersService extends BaseService {
    protected override baseUrlService = "ProjectUsers";

    public getUsers(projectId: string): Observable<User[]> {
        return this.httpList<UserDto, User>(User, projectId + "/users");
    }
}
