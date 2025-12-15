import { inject, Injectable } from '@angular/core';
import { ConsumeInvitationResultDto } from '@features/invitations/dto/consume-invitation-result.dto';
import { InvitationsService } from '@features/invitations/services/invitations.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvitationsStore {
    private readonly invitationsService = inject(InvitationsService);

    public create(projectId: string, lifetime: string = "7.00:00:00"): Promise<string> {
        return firstValueFrom(this.invitationsService.create(projectId, lifetime));
    }

    public consume(token: string): Promise<ConsumeInvitationResultDto> {
        return firstValueFrom(this.invitationsService.consume(token));
    }
}
