export class AppConfig {
    public devMode: boolean;

    public constructor(obj: AppConfig | null = null) {
        this.devMode = false;
        if (obj) {
            this.devMode = obj.devMode;
        }
    }
}
