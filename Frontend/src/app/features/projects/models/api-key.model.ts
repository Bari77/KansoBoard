import { ApiKeyDto } from "../dto/api-key.dto";

export class ApiKey {
    public constructor(
        public id: string = "",
        public key: string = "",
        public projectId: string = "",
        public createdAt: Date = new Date(),
        public expiredAt: Date | null = null,
        public revoked: boolean = false,
    ) { }

    public static fromDto(dto: ApiKeyDto): ApiKey {
        return new ApiKey(dto.id, dto.key, dto.projectId, dto.createdAt, dto.expiredAt, dto.revoked);
    }
}