import { CardCustomFieldValueDto } from "@features/cards/dto/card-custom-field-value.dto";

export class CardCustomFieldValue {
    public constructor(
        public fieldId: string = "",
        public textValue: string | null = null,
        public numberValue: number | null = null,
    ) { }

    public static fromDto(dto: CardCustomFieldValueDto): CardCustomFieldValue {
        return new CardCustomFieldValue(dto.fieldId, dto.textValue ?? null, dto.numberValue ?? null);
    }
}
