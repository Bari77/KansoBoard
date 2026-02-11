import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, effect, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatToolbar } from "@angular/material/toolbar";
import { MatTooltip } from "@angular/material/tooltip";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { LoadingComponent } from "@core/layout/splash/components/loading/loading.component";
import { LoadingStore } from "@core/stores/loading.store";
import { TokenStore } from "@features/auth/stores/token.store";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AppStore } from "app/app.store";
import { filter } from "rxjs";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, RouterLink, CommonModule, TranslateModule, LoadingComponent, MatToolbar, MatCardModule, MatTooltip],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    public readonly loadingStore = inject(LoadingStore);
    public readonly appStore = inject(AppStore);
    public readonly tokenData = computed(() => this.tokenStore.tokenData());

    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly tokenStore = inject(TokenStore);

    public constructor() {
        this.translate.addLangs(["fr", "en"]);
        this.translate.setFallbackLang("fr");
        this.translate.use("fr");
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: any) => {
                (window as any)._paq.push(['setCustomUrl', e.urlAfterRedirects]);
                (window as any)._paq.push(['trackPageView']);
            });

        effect(() => {
            const data = this.tokenStore.tokenData();
            const paq = (window as any)._paq;
            if (paq) {
                if (data?.pseudo) {
                    paq.push(["setUserId", data.pseudo]);
                } else {
                    paq.push(["resetUserId"]);
                }
            }
        });
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
