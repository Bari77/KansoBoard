import { ProjectCustomFieldDto } from "@features/projects/dto/project-custom-field.dto";

export interface ProjectDto {
    id: string;
    name: string;
    customFields: ProjectCustomFieldDto[];
}