import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@features/auth/stores/auth.store';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslateModule,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public readonly fb = inject(FormBuilder);

    public readonly loading = signal(false);
    public readonly error = signal('');
    public readonly form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    private readonly router = inject(Router);
    private readonly authStore = inject(AuthStore);

    async submit() {
        if (this.form.invalid) return;

        this.loading.set(true);
        this.error.set("");

        try {
            await this.authStore.login(this.form.value.email!, this.form.value.password!);
            await this.router.navigate(['/projects']);
        } catch {
            this.error.set("ERROR.ERR_LOGIN_FAILED");
        } finally {
            this.loading.set(false);
        }
    }
}
