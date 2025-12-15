import { ConsumeInvitationResultDto } from "@features/invitations/dto/consume-invitation-result.dto";

export class ConsumeInvitationResult {
    public constructor(
        public projectId: string = "",
        public alreadyMember: boolean = false,
    ) { }

    public static fromDto(dto: ConsumeInvitationResultDto): ConsumeInvitationResult {
        return new ConsumeInvitationResult(dto.projectId, dto.alreadyMember);
    }
}
