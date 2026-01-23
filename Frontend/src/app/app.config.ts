import { registerLocaleData } from "@angular/common";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import { ApplicationConfig, LOCALE_ID, importProvidersFrom, inject, provideAppInitializer, provideZoneChangeDetection } from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { GlobalLoaderOverlayDirective } from "@core/directives/loader.directive";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { loaderInterceptor } from "@core/interceptors/loader.interceptor";
import { tokenInterceptor } from "@core/interceptors/token.interceptor";
import { ToastService } from "@core/services/toast.service";
import { LoadingStore } from "@core/stores/loading.store";
import { AuthService } from "@features/auth/services/auth.service";
import { AuthStore } from "@features/auth/stores/auth.store";
import { TokenStore } from "@features/auth/stores/token.store";
import { BoardsService } from "@features/boards/services/boards.service";
import { BoardStore } from "@features/boards/stores/board.store";
import { BoardsStore } from "@features/boards/stores/boards.store";
import { CardsService } from "@features/cards/services/cards.service";
import { CardsStore } from "@features/cards/stores/cards.store";
import { ColumnsService } from "@features/columns/services/columns.service";
import { ColumnsStore } from "@features/columns/stores/columns.store";
import { ConfigStore } from "@features/configs/store/config.store";
import { InvitationsService } from "@features/invitations/services/invitations.service";
import { InvitationsStore } from "@features/invitations/stores/invitations.store";
import { ApiKeysService } from "@features/projects/services/api-keys.service";
import { ProjectsService } from "@features/projects/services/projects.service";
import { ApiKeysStore } from "@features/projects/stores/api-keys.store";
import { ProjectsStore } from "@features/projects/stores/projects.store";
import { ProjectUsersService } from "@features/users/services/project-users.service";
import { ProjectUsersStore } from "@features/users/stores/project-users.store";
import { TranslateService, provideTranslateService } from "@ngx-translate/core";
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import { StorageService } from "@shared/services/storage.service";
import { appRoutes } from "app/app.routes";
import { AppStore } from "app/app.store";
import { zip } from "rxjs";

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({
            eventCoalescing: true,
        }),
        provideRouter(appRoutes),
        provideHttpClient(withInterceptors([loaderInterceptor, errorInterceptor, tokenInterceptor])),
        provideAppInitializer(() => zip(inject(TranslateService).reloadLang("fr"), inject(ConfigStore).initApp())),
        provideAnimationsAsync(),
        provideNativeDateAdapter(),
        provideTranslateService({
            lang: "fr",
            fallbackLang: "fr",
            loader: provideTranslateHttpLoader({
                prefix: "./assets/i18n/",
                suffix: ".json",
            }),
        }),
        importProvidersFrom(BrowserModule, MatFormFieldModule),
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                verticalPosition: "top",
                horizontalPosition: "right",
            },
        },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { width: "500px" } },
        { provide: LOCALE_ID, useValue: "fr-FR" },

        GlobalLoaderOverlayDirective,

        ToastService,
        StorageService,
        AuthService,
        ProjectsService,
        BoardsService,
        ColumnsService,
        CardsService,
        InvitationsService,
        ApiKeysService,
        ProjectUsersService,

        LoadingStore,
        ConfigStore,
        AppStore,
        AuthStore,
        TokenStore,
        ProjectsStore,
        BoardsStore,
        BoardStore,
        ColumnsStore,
        CardsStore,
        InvitationsStore,
        ApiKeysStore,
        ProjectUsersStore,
    ],
};
