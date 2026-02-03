import { UserCardDto } from '@features/cards/dto/user-card.dto';
import { CardPriority } from '@features/cards/enums/card-priority.enum';
import { CardType } from '@features/cards/enums/card-type.enum';
import { Card } from './card.model';

export class UserCard extends Card {
    public constructor(
        id: string = '',
        number: number = 0,
        title: string = '',
        order: number = 0,
        description: string | null = null,
        type: CardType = CardType.Task,
        priority: CardPriority = CardPriority.Normal,
        columnId: string = '',
        assignedToUserId: string | null = null,
        public boardId: string = '',
    ) {
        super(id, number, title, order, description, type, priority, columnId, assignedToUserId);
    }

    public static override fromDto(dto: UserCardDto): UserCard {
        return new UserCard(
            dto.id,
            dto.number,
            dto.title,
            dto.order,
            dto.description ?? null,
            dto.type as CardType,
            dto.priority as CardPriority,
            dto.columnId,
            dto.assignedToUserId ?? null,
            dto.boardId,
        );
    }
}
