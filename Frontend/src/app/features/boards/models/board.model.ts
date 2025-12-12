import { BoardDto } from "@features/boards/dto/board.dto";

export class Board {
    public constructor(
        public id: string = "",
        public name: string = "",
        public projectId: string = "",
    ) { }

    public static fromDto(dto: BoardDto): Board {
        return new Board(dto.id, dto.name, dto.projectId);
    }
}
