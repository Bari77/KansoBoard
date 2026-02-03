import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

export const routes: Routes = [
    { path: "", component: DashboardComponent, canActivate: [AuthGuard] },
];
