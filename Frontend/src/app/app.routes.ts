import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { UnauthGuard } from "@core/guards/unauthGuard";

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
    },
    {
        path: "auth",
        loadChildren: () => import("./features/auth/auth.routes").then((m) => m.routes),
        canActivate: [UnauthGuard],
    },
    {
        path: "home",
        loadChildren: () => import("./features/home/home.routes").then((m) => m.routes),
        canActivate: [AuthGuard],
    },
];
