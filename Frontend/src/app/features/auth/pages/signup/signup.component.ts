import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
    selector: 'app-signup',
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
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    public readonly fb = inject(FormBuilder);

    public readonly form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        pseudo: ['', Validators.required],
        password: ['', Validators.required]
    });

    private readonly router = inject(Router);
    private readonly authStore = inject(AuthStore);

    async submit() {
        if (this.form.invalid) return;

        try {
            await this.authStore.register(this.form.value.email!, this.form.value.pseudo!, this.form.value.password!);
            await this.router.navigate(['/login']);
        } catch {
            // Erreur déjà affichée par l'intercepteur (toast)
        }
    }
}
