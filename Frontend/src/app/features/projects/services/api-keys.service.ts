import { Injectable } from "@angular/core";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";
import { ApiKeyDto } from "../dto/api-key.dto";
import { ApiKey } from "../models/api-key.model";

@Injectable()
export class ApiKeysService extends BaseService {
    protected override baseUrlService = "ApiKeys";

    public create(projectId: string, lifetime?: string): Observable<string> {
        return this.httpPostString(projectId, { lifetime });
    }

    public revoke(projectId: string, key: string): Observable<void> {
        return this.httpPostVoid(`${projectId}/revoke`, { key });
    }

    public get(projectId: string): Observable<ApiKey | null> {
        return this.httpGet<ApiKeyDto, ApiKey>(ApiKey, projectId);
    }
}
