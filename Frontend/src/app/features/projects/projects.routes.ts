import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { ProjectComponent } from "./pages/project/project.component";
import { ProjectsComponent } from "./pages/projects/projects.component";

export const routes: Routes = [
    { path: "", component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: ":guid", component: ProjectComponent, canActivate: [AuthGuard] }
];
