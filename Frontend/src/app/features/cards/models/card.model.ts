import { CardDto } from '@features/cards/dto/card.dto';
import { CardPriority } from '@features/cards/enums/card-priority.enum';
import { CardType } from '@features/cards/enums/card-type.enum';

export class Card {
    public constructor(
        public id: string = '',
        public number: number = 0,
        public title: string = '',
        public order: number = 0,
        public description: string | null = null,
        public type: CardType = CardType.Feature,
        public priority: CardPriority = CardPriority.Normal,
        public columnId: string = '',
        public assignedToUserId: string | null = null,
    ) { }

    public static fromDto(dto: CardDto): Card {
        return new Card(
            dto.id,
            dto.number,
            dto.title,
            dto.order,
            dto.description ?? null,
            dto.type as CardType,
            dto.priority as CardPriority,
            dto.columnId,
            dto.assignedToUserId ?? null,
        );
    }
}
