import { ProjectDto } from "@features/projects/dto/project.dto";

export class Project {
    public constructor(
        public id: string = "",
        public name: string = "",
    ) { }

    public static fromDto(dto: ProjectDto): Project {
        return new Project(dto.id, dto.name);
    }
}