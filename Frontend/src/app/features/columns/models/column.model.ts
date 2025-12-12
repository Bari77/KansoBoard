import { ColumnDto } from "@features/columns/dto/column.dto";

export class Column {
    public constructor(
        public id: string = "",
        public name: string = "",
        public order: number = 0,
        public boardId: string = "",
    ) { }

    public static fromDto(dto: ColumnDto): Column {
        return new Column(dto.id, dto.name, dto.order, dto.boardId);
    }
}
