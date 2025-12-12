import { Injectable } from "@angular/core";
import { ProjectDto } from "@features/projects/dto/project.dto";
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

    public create(name: string): Observable<Project> {
        return this.httpPost<ProjectDto, Project>(Project, "", { name });
    }

    public update(id: string, name: string): Observable<Project | null> {
        return this.httpPut<ProjectDto, Project>(Project, id, { name });
    }

    public delete(id: string): Observable<void> {
        return this.httpDelete(id);
    }
}
