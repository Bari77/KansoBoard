import { AuthTokensDto } from "@features/auth/dto/auth-tokens.dto";

export class AuthTokens {
    public constructor(
        public accessToken: string = "",
        public refreshToken: string = "",
    ) { }

    public static fromDto(dto: AuthTokensDto): AuthTokens {
        return new AuthTokens(dto.accessToken, dto.refreshToken);
    }
}
