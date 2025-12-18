import { Injectable } from '@angular/core';
import { ConsumeInvitationResultDto } from '@features/invitations/dto/consume-invitation-result.dto';
import { ConsumeInvitationResult } from '@features/invitations/models/consume-invitation-result.model';
import { BaseService } from '@shared/services/base.service';
import { Observable } from 'rxjs';

@Injectable()
export class InvitationsService extends BaseService {
    protected override baseUrlService = "Invitations";

    public create(projectId: string, lifetime: string = "7.00:00:00"): Observable<string> {
        return this.httpPostString(`${projectId}/create`, { projectId, lifetime });
    }

    public consume(token: string): Observable<ConsumeInvitationResultDto> {
        return this.httpPost<ConsumeInvitationResultDto, ConsumeInvitationResult>(ConsumeInvitationResult, `consume`, { token });
    }
}
