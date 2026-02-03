export interface UserCardDto {
    id: string;
    number: number;
    title: string;
    order: number;
    description?: string | null;
    type: number;
    priority: number;
    columnId: string;
    assignedToUserId?: string | null;
    boardId: string;
}
