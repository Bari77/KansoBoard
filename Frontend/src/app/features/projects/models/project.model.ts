import { ProjectDto } from "@features/projects/dto/project.dto";
import { ProjectCustomField } from "@features/projects/models/project-custom-field.model";

export class Project {
    public constructor(
        public id: string = "",
        public name: string = "",
        public customFields: ProjectCustomField[] = [],
    ) { }

    public static fromDto(dto: ProjectDto): Project {
        return new Project(dto.id, dto.name, (dto.customFields ?? []).map(ProjectCustomField.fromDto));
    }
}