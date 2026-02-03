import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { UnauthGuard } from "@core/guards/unauthGuard";

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
    },
    {
        path: "auth",
        loadChildren: () => import("./features/auth/auth.routes").then((m) => m.routes),
        canActivate: [UnauthGuard],
    },
    {
        path: "dashboard",
        loadChildren: () => import("./features/dashboard/dashboard.routes").then((m) => m.routes),
        canActivate: [AuthGuard],
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
    {
        path: "**",
        redirectTo: "dashboard",
    },
];
