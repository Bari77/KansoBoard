import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { HomeComponent } from "@features/home/pages/home.component";

export const routes: Routes = [{ path: "", component: HomeComponent, canActivate: [AuthGuard] }];
