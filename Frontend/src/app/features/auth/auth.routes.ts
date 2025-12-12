import { Routes } from "@angular/router";
import { UnauthGuard } from "@core/guards/unauthGuard";
import { LoginComponent } from "@features/auth/pages/login/login.component";
import { SignupComponent } from "./pages/signup/signup.component";

export const routes: Routes = [
    { path: "login", component: LoginComponent, canActivate: [UnauthGuard] },
    { path: "signup", component: SignupComponent, canActivate: [UnauthGuard] }
];
