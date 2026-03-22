import { CardDto } from "@features/cards/dto/card.dto";

export interface UserCardDto extends CardDto {
    boardId: string;
}
