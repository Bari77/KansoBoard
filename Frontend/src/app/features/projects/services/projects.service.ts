import { Injectable } from "@angular/core";
import { ProjectCustomFieldRequestDto } from "@features/projects/dto/project-custom-field-request.dto";
import { ProjectDto } from "@features/projects/dto/project.dto";
import { ProjectCustomFieldType } from "@features/projects/models/project-custom-field-type.enum";
import { Project } from "@features/projects/models/project.model";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";

@Injectable()
export class ProjectsService extends BaseService {
    protected override baseUrlService = "Projects";

    public list(): Observable<Project[]> {
        return this.httpList<ProjectDto, Project>(Project);
    }

    public get(id: string): Observable<Project | null> {
        return this.httpGet<ProjectDto, Project>(Project, id);
    }

    public create(name: string, customFields: Project["customFields"]): Observable<Project> {
        return this.httpPost<ProjectDto, Project>(Project, "", {
            name,
            customFields: this.toRequestCustomFields(customFields),
        });
    }

    public update(id: string, name: string, customFields: Project["customFields"]): Observable<Project | null> {
        return this.httpPut<ProjectDto, Project>(Project, id, {
            name,
            customFields: this.toRequestCustomFields(customFields),
        });
    }

    public delete(id: string): Observable<void> {
        return this.httpDelete(id);
    }

    private toRequestCustomFields(customFields: Project["customFields"]): ProjectCustomFieldRequestDto[] {
        return customFields.map((field) => ({
            id: field.id || null,
            label: field.label,
            type: field.type,
            allowCustomValues: field.type === ProjectCustomFieldType.Combo ? field.allowCustomValues : false,
            options: field.type === ProjectCustomFieldType.Combo ? field.options : null,
        }));
    }
}
