import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { ProfileComponent } from "./pages/profile/profile.component";

export const routes: Routes = [
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
];
