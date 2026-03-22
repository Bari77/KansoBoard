import { AsyncPipe } from "@angular/common";
import { Component, computed, inject, model } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AskDialogComponent } from "@core/layout/dialogs/components/ask-dialog/ask-dialog.component";
import { AskDialogData } from "@core/models/ask-dialog.model";
import { ToastService } from "@core/services/toast.service";
import { BoardsStore } from "@features/boards/stores/boards.store";
import { CardCustomFieldValue } from "@features/cards/models/card-custom-field-value.model";
import { CardPriority } from "@features/cards/enums/card-priority.enum";
import { CardType } from "@features/cards/enums/card-type.enum";
import { Card } from "@features/cards/models/card.model";
import { CardsStore } from "@features/cards/stores/cards.store";
import { ProjectCustomFieldType } from "@features/projects/models/project-custom-field-type.enum";
import { ProjectCustomField } from "@features/projects/models/project-custom-field.model";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { CreatableComboboxComponent } from "@shared/components/creatable-combobox/creatable-combobox.component";
import { User } from "@features/users/models/user.model";
import { ProjectUsersStore } from "@features/users/stores/project-users.store";
import { TranslateModule } from "@ngx-translate/core";
import { map, Observable, startWith } from "rxjs";

@Component({
    selector: "card-dialog",
    standalone: true,
    imports: [
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslateModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
        MatAutocompleteModule,
        MatMenuModule,
        ReactiveFormsModule,
        AsyncPipe,
        CreatableComboboxComponent,
    ],
    templateUrl: "./card-dialog.component.html",
    styleUrls: ["./card-dialog.component.scss"],
})
export class CardDialogComponent {
    public readonly data = inject<Card | null>(MAT_DIALOG_DATA);
    public readonly card = model(this.data ? { ...this.data } : new Card());
    public readonly types = computed(() => Object.values(CardType).filter(v => typeof v === 'number'));
    public readonly priorities = computed(() => Object.values(CardPriority).filter(v => typeof v === 'number'));
    public readonly projectUsersStore = inject(ProjectUsersStore);
    public readonly boardsStore = inject(BoardsStore);
    public readonly projectsStore = inject(ProjectsStore);
    public readonly assignedControl = new FormControl<User | undefined>(this.getAssignedUser());
    public readonly filteredUsers: Observable<User[]>;
    public readonly projectCustomFields = computed(() => this.projectsStore.currentProject()?.customFields ?? []);

    private readonly dialogRef = inject(MatDialogRef<CardDialogComponent>);
    private readonly dialog = inject(MatDialog);
    private readonly toastService = inject(ToastService);
    private readonly cardsStore = inject(CardsStore);

    constructor() {
        this.filteredUsers = this.assignedControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.pseudo;
                return name ? this.filter(name as string) : this.projectUsersStore.projectUsers().slice();
            }),
        );
    }

    public canConfirm(): boolean {
        return !!this.card().title
            && this.card().type !== null
            && this.card().priority !== null;
    }

    public close(): void {
        this.dialogRef.close();
    }

    public confirm(): void {
        this.compactCustomFields();
        this.dialogRef.close(this.card());
    }

    public async delete(): Promise<void> {
        const dialogRef = this.dialog.open<AskDialogComponent, AskDialogData, AskDialogData>(AskDialogComponent, {
            data: {
                message: "CARDS.DELETE_ASK",
            },
            width: "400px",
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (!result) return;

            try {
                await this.cardsStore.delete(this.card().id);
                this.toastService.success("CARDS.DELETE_OK");
                this.close();
            } catch {
                this.toastService.error("CARDS.DELETE_KO");
            }
        });
    }

    public getAssignedUser(): User | undefined {
        return this.projectUsersStore.getUser(this.card().assignedToUserId);
    }

    public assignUser(selected: MatAutocompleteSelectedEvent): void {
        this.cardsStore.assign(this.card().id, selected.option.value.id);
    }

    public unassignUser(): void {
        this.cardsStore.assign(this.card().id, null);
        this.assignedControl.setValue(undefined);
    }

    public transfer(boardId: string): void {
        this.cardsStore.transfer(this.card().id, boardId);
        this.close();
    }

    public duplicate(): void {
        this.cardsStore.create(
            this.card().columnId,
            this.card().title,
            this.card().description,
            this.card().type,
            this.card().priority,
            this.card().customFields,
        );
        this.close();
    }

    public displayFn(user: User): string {
        return user && user.pseudo ? user.pseudo : "";
    }

    public getTextValue(fieldId: string): string {
        return this.card().customFields.find((field) => field.fieldId === fieldId)?.textValue ?? "";
    }

    public setTextValue(fieldId: string, value: string): void {
        const field = this.ensureField(fieldId);
        field.textValue = value?.trim() || null;
        field.numberValue = null;
        this.compactCustomFields();
    }

    public getNumberValue(fieldId: string): number | null {
        return this.card().customFields.find((field) => field.fieldId === fieldId)?.numberValue ?? null;
    }

    public setNumberValue(fieldId: string, value: number | null): void {
        const field = this.ensureField(fieldId);
        field.numberValue = value;
        field.textValue = null;
        this.compactCustomFields();
    }

    public getComboValue(fieldId: string): string | null {
        return this.card().customFields.find((field) => field.fieldId === fieldId)?.textValue ?? null;
    }

    public setComboValue(fieldId: string, value: string | null): void {
        const field = this.ensureField(fieldId);
        field.textValue = value?.trim() || null;
        field.numberValue = null;
        this.compactCustomFields();
    }

    public isTextField(field: ProjectCustomField): boolean {
        return field.type === ProjectCustomFieldType.Text;
    }

    public isNumberField(field: ProjectCustomField): boolean {
        return field.type === ProjectCustomFieldType.Number;
    }

    public isComboField(field: ProjectCustomField): boolean {
        return field.type === ProjectCustomFieldType.Combo;
    }

    private filter(name: string): User[] {
        const filterValue = name.toLowerCase();
        return this.projectUsersStore.projectUsers().filter(user => user.pseudo.toLowerCase().includes(filterValue));
    }

    private ensureField(fieldId: string): CardCustomFieldValue {
        let existing = this.card().customFields.find((field) => field.fieldId === fieldId);
        if (existing)
            return existing;

        existing = new CardCustomFieldValue(fieldId, null, null);
        this.card().customFields.push(existing);
        return existing;
    }

    private compactCustomFields(): void {
        this.card.update((card) => ({
            ...card,
            customFields: card.customFields.filter((field) =>
                field.numberValue !== null || !!field.textValue?.trim()
            ),
        }));
    }
}
