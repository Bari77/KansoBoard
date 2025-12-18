import { CdkCopyToClipboard } from "@angular/cdk/clipboard";
import { Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoadingStore } from "@core/stores/loading.store";
import { ApiKeysStore } from "@features/projects/stores/api-keys.store";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: "project-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatChipsModule,
        TranslateModule,
        CdkCopyToClipboard,
        MatIconModule
    ],
    templateUrl: "./api-key-dialog.component.html",
    styleUrls: ["./api-key-dialog.component.scss"],
})
export class ApiKeyDialogComponent {
    public readonly apiKeyStore = inject(ApiKeysStore);
    public readonly loadingStore = inject(LoadingStore);
    public readonly apiKey = computed(() => this.apiKeyStore.apiKey());

    private readonly dialogRef = inject(MatDialogRef<ApiKeyDialogComponent>);

    public async new(): Promise<void> {
        if (this.apiKey()) {
            await this.apiKeyStore.renew();
        } else {
            await this.apiKeyStore.create();
        }
    }

    public close(): void {
        this.dialogRef.close();
    }
}
