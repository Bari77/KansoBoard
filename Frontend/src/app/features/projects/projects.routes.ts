import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { ProjectComponent } from "@features/projects/pages/project/project.component";
import { projectResolver } from "@features/projects/pages/project/project.resolver";
import { ProjectsComponent } from "@features/projects/pages/projects/projects.component";
import { projectsResolver } from "@features/projects/pages/projects/projects.resolver";

export const routes: Routes = [
    { path: "", component: ProjectsComponent, canActivate: [AuthGuard], resolve: { load: projectsResolver } },
    { path: ":guid", component: ProjectComponent, canActivate: [AuthGuard], resolve: { load: projectResolver } }
];