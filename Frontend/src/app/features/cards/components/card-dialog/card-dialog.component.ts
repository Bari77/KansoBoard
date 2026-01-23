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
import { CardPriority } from "@features/cards/enums/card-priority.enum";
import { CardType } from "@features/cards/enums/card-type.enum";
import { Card } from "@features/cards/models/card.model";
import { CardsStore } from "@features/cards/stores/cards.store";
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
    public readonly assignedControl = new FormControl<User | undefined>(this.getAssignedUser());
    public readonly filteredUsers: Observable<User[]>;

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

    public displayFn(user: User): string {
        return user && user.pseudo ? user.pseudo : "";
    }

    private filter(name: string): User[] {
        const filterValue = name.toLowerCase();
        return this.projectUsersStore.projectUsers().filter(user => user.pseudo.toLowerCase().includes(filterValue));
    }
}
