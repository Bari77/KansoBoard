import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SplashComponent } from "../splash/splash.component";

@Component({
    selector: "app-loading",
    standalone: true,
    imports: [CommonModule, SplashComponent],
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent {
    public readonly translate = inject(TranslateService);
    public readonly message = signal<string>(this.translate.instant("GLOBAL.LOADING"));
}
