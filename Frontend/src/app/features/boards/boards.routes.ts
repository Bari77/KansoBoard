import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { BoardComponent } from "./pages/board/board.component";

export const routes: Routes = [
    { path: ":guid", component: BoardComponent, canActivate: [AuthGuard] },
];
