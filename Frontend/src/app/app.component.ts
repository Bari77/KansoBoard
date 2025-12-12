import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink, RouterOutlet } from "@angular/router";
import { LoadingComponent } from "@core/layout/splash/components/loading/loading.component";
import { TokenStore } from "@features/auth/stores/token.store";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AppStore } from "app/app.store";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, RouterLink, CommonModule, TranslateModule, LoadingComponent, MatToolbar, MatCardModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    public readonly appStore = inject(AppStore);
    public readonly tokenData = computed(() => this.tokenStore.tokenData());

    private readonly translate = inject(TranslateService);
    private readonly tokenStore = inject(TokenStore);

    public constructor() {
        this.translate.addLangs(["fr", "en"]);
        this.translate.setFallbackLang("fr");
        this.translate.use("fr");
    }

    public async ngOnInit(): Promise<void> {
        this.appStore.setLoading(true);

        try {
            // Init stores
            await this.tokenStore.init();
        } catch (err) {
            console.error("Initialization error :", err);
        } finally {
            this.appStore.setLoading(false);
        }
    }
}
