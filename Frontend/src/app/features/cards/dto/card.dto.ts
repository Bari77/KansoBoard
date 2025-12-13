export interface CardDto {
    id: string;
    number: number;
    title: string;
    description?: string | null;
    type: number;
    priority: number;
    columnId: string;
    assignedToUserId?: string | null;
}
