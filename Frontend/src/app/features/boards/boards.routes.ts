import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/authGuard";
import { BoardComponent } from "./pages/board/board.component";
import { boardResolver } from "./pages/board/board.resolver";

export const routes: Routes = [
    { path: ":guid", component: BoardComponent, canActivate: [AuthGuard], resolve: { load: boardResolver } },
];
