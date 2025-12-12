import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { UnauthGuard } from "@core/guards/unauthGuard";

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "projects",
        pathMatch: "full",
    },
    {
        path: "auth",
        loadChildren: () => import("./features/auth/auth.routes").then((m) => m.routes),
        canActivate: [UnauthGuard],
    },
    {
        path: "projects",
        loadChildren: () => import("./features/projects/projects.routes").then((m) => m.routes),
        canActivate: [AuthGuard],
    },
    {
        path: "boards",
        loadChildren: () => import("./features/boards/boards.routes").then((m) => m.routes),
        canActivate: [AuthGuard],
    },
];
