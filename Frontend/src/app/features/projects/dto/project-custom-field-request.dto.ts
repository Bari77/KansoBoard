export interface ProjectCustomFieldRequestDto {
    id?: string | null;
    label: string;
    type: number;
    allowCustomValues: boolean;
    options?: string[] | null;
}
