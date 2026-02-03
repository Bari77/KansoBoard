import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { Router } from "@angular/router";
import { ToastService } from "@core/services/toast.service";
import { AuthService } from "@features/auth/services/auth.service";
import { AppConfig } from "@features/configs/models/app-config.model";
import { ConfigStore } from "@features/configs/store/config.store";
import { UsersService } from "@features/users/services/users.service";
import { TranslateModule } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";

@Component({
    selector: "app-profile",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        TranslateModule,
    ],
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
    public readonly fb = inject(FormBuilder);
    public readonly usersService = inject(UsersService);
    public readonly authService = inject(AuthService);
    public readonly configStore = inject(ConfigStore);
    public readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    public readonly loading = signal(false);
    public readonly avatarPreview = signal<string | null>(null);

    public readonly form = this.fb.group({
        pseudo: ["", [Validators.required]],
        avatarUrl: [""],
    });

    public readonly devMode = signal(false);

    public async ngOnInit(): Promise<void> {
        this.loading.set(true);
        try {
            const user = await firstValueFrom(this.authService.getMe());
            if (user) {
                this.form.patchValue({
                    pseudo: user.pseudo,
                    avatarUrl: user.avatarUrl || "",
                });
                this.avatarPreview.set(user.avatarUrl || null);
            }

            this.devMode.set(this.configStore.appConfig().devMode);
        } catch (error) {
            this.toastService.error("PROFILE.ERROR_LOADING");
        } finally {
            this.loading.set(false);
        }
    }

    public onAvatarUrlChange(): void {
        const url = this.form.value.avatarUrl || "";
        this.avatarPreview.set(url || null);
    }

    public async onDevModeToggle(): Promise<void> {
        const newValue = !this.devMode();
        this.devMode.set(newValue);

        const config = new AppConfig(this.configStore.appConfig());
        config.devMode = newValue;
        await this.configStore.setConfig(config);
    }

    public async onSubmit(): Promise<void> {
        if (this.form.invalid) return;

        this.loading.set(true);
        try {
            await firstValueFrom(
                this.usersService.updateMe(
                    this.form.value.pseudo!,
                    this.form.value.avatarUrl || undefined
                )
            );
            this.toastService.success("PROFILE.SUCCESS_UPDATE");

            window.location.reload();
        } catch (error) {
            this.toastService.error("PROFILE.ERROR_UPDATE");
        } finally {
            this.loading.set(false);
        }
    }

    public async onLogout(): Promise<void> {
        this.loading.set(true);
        try {
            await firstValueFrom(this.authService.logout());
            await this.router.navigate(["/auth/login"]);
        } catch (error) {
            this.toastService.error("PROFILE.ERROR_LOGOUT");
        } finally {
            this.loading.set(false);
        }
    }
}
