# Frontend

## Stack & environment

The frontend is an **Angular 21** application (Material, CDK, i18n via `@ngx-translate`). Dependencies are managed with **npm** or **Bun** (`bun.lock` is present).

The API URL is configured in `src/environments/` according to the configuration (dev, staging, production).

---

## 📦 Install dependencies

From `Frontend`:

```sh
npm install
```

or with Bun:

```sh
bun install
```

---

## 🚀 Run the application in development

From `Frontend`:

```sh
npm run start
```

or:

```sh
bun run start
```

This command runs `prebuild.js` then `ng serve`. The application is available (by default) at **http://localhost:4200**.

---

## 🏗 Build

### Development build (watch)

```sh
npm run watch
```

### Production build

```sh
npm run build-prod
```

### Staging build

```sh
npm run build-staging
```

### Default build (no prebuild)

```sh
npm run build
```

---

## 🧪 Other commands

- **Lint**: `npm run lint`
- **Documentation (Compodoc)**: `npm run doc`
- **Angular update**: `npm run update`

---

## 📌 Notes

- The `prebuild.js` script is run before `ng serve` and prod/staging builds to prepare the environment.

- Environments are in `src/environments/`:
  - `environment.ts`: development (e.g. `apiUrl: https://localhost:7033/api`)
  - `environment.staging.ts`: staging
  - `environment.prod.ts`: production

- In dev, ensure the backend (API) is running if the app needs to call the API (default port 7033 over HTTPS).

---

## 🧭 Useful commands

```sh
npm install
npm run start
npm run build-prod
npm run build-staging
npm run watch
npm run lint
```

---

## ✔️ Status

Angular application operational.
