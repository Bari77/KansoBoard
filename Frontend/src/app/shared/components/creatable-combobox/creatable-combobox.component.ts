import { AsyncPipe } from "@angular/common";
import { Component, computed, effect, input, model } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { map, startWith } from "rxjs";

@Component({
    selector: "app-creatable-combobox",
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        TranslateModule,
        AsyncPipe,
    ],
    templateUrl: "./creatable-combobox.component.html",
    styleUrls: ["./creatable-combobox.component.scss"],
})
export class CreatableComboboxComponent {
    public readonly label = input<string>("");
    public readonly placeholder = input<string>("");
    public readonly allowCreate = input<boolean>(false);
    public readonly options = input<string[]>([]);
    public readonly value = model<string | null>(null);

    public readonly control = new FormControl<string>("");
    public readonly filteredOptions = this.control.valueChanges.pipe(
        startWith(""),
        map((term) => this.getFiltered(term ?? "")),
    );
    public readonly canCreateCurrent = computed(() => {
        const term = (this.control.value ?? "").trim();
        if (!this.allowCreate() || !term)
            return false;
        return !this.options().some((option) => option.toLowerCase() === term.toLowerCase());
    });

    constructor() {
        effect(() => {
            this.control.setValue(this.value() ?? "", { emitEvent: false });
        });
    }

    public selectOption(selected: MatAutocompleteSelectedEvent): void {
        this.value.set(selected.option.value);
    }

    public commitCurrentInput(): void {
        const term = (this.control.value ?? "").trim();

        if (!term) {
            this.value.set(null);
            this.control.setValue("", { emitEvent: false });
            return;
        }

        if (this.allowCreate()) {
            this.value.set(term);
            this.control.setValue(term, { emitEvent: false });
            return;
        }

        const existing = this.options().find((option) => option.toLowerCase() === term.toLowerCase());
        this.value.set(existing ?? null);
        this.control.setValue(existing ?? "", { emitEvent: false });
    }

    private getFiltered(term: string): string[] {
        const normalized = term.toLowerCase().trim();
        if (!normalized)
            return [...this.options()];
        return this.options().filter((option) => option.toLowerCase().includes(normalized));
    }
}
