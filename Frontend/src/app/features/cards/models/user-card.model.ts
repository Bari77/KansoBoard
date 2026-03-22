import { UserCardDto } from '@features/cards/dto/user-card.dto';
import { CardPriority } from '@features/cards/enums/card-priority.enum';
import { CardType } from '@features/cards/enums/card-type.enum';
import { CardCustomFieldValue } from '@features/cards/models/card-custom-field-value.model';
import { CardDto } from '@features/cards/dto/card.dto';
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
        customFields: CardCustomFieldValue[] = [],
        public boardId: string = '',
    ) {
        super(id, number, title, order, description, type, priority, columnId, assignedToUserId, customFields);
    }

    public static override fromDto(dto: CardDto): UserCard {
        const userCardDto = dto as UserCardDto;
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
            (dto.customFields ?? []).map(CardCustomFieldValue.fromDto),
            userCardDto.boardId,
        );
    }
}
