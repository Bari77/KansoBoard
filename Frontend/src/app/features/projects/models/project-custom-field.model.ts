import { ProjectCustomFieldDto } from "@features/projects/dto/project-custom-field.dto";
import { ProjectCustomFieldType } from "@features/projects/models/project-custom-field-type.enum";

export class ProjectCustomField {
    public constructor(
        public id: string = "",
        public label: string = "",
        public type: ProjectCustomFieldType = ProjectCustomFieldType.Text,
        public allowCustomValues: boolean = false,
        public options: string[] = [],
    ) { }

    public static fromDto(dto: ProjectCustomFieldDto): ProjectCustomField {
        return new ProjectCustomField(
            dto.id,
            dto.label,
            dto.type as ProjectCustomFieldType,
            dto.allowCustomValues,
            dto.options ?? [],
        );
    }
}
