import { UserDto } from "@features/users/dto/user.dto";

export class User {
    public constructor(
        public id: string = "",
        public email: string = "",
        public pseudo: string = "",
        public avatarUrl?: string,
    ) { }

    public static fromDto(dto: UserDto): User {
        return new User(dto.id, dto.email, dto.pseudo, dto.avatarUrl);
    }
}