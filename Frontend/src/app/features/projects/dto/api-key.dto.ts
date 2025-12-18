export interface ApiKeyDto {
    id: string;
    projectId: string;
    key: string;
    createdAt: Date;
    expiredAt: Date | null;
    revoked: boolean;
}