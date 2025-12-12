export interface TokenPayloadDto {
    sub: string;
    email: string;
    pseudo: string;
    avatar: string | null;
    exp: number;
    iat: number;
    data: string;
}