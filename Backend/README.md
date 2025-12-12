# Backend

## EF Core Migrations & Database

This backend uses **Entity Framework Core (Code-First)** with a **SQLite** database persisted in the `Api/Data` folder.

Migrations are stored in the **Infrastructure** project, while **the application starts via the API**, which requires always specifying:

- `--project` → Infrastructure (where the migrations are located)
- `--startup-project` → API (entry point)

---

## 🧱 Create a migration

From `Backend/Api`:

```sh
dotnet ef migrations add YourMigrationName --project ../Infrastructure --startup-project .
```

Examples:

```sh
dotnet ef migrations add AddCardPriority
dotnet ef migrations add RenameBoardTable
```

The generated files will appear in:

```
Backend/Infrastructure/Migrations/
```

---

## 🚀 Apply the migrations to the database

```sh
dotnet ef database update --project ../Infrastructure --startup-project .

```

---

## 🔄 Completely regenerate the database (reset)

Useful in development if the model changes frequently.

### Complete reset:
```sh
rm -rf Data # Linux/Mac
rd /s /q Data # Windows

dotnet ef database update --project ../Infrastructure --startup-project .

```

⚠️ Completely removes `kanso.db`.

---

## 🧪 Check migrations

```sh
dotnet ef migrations list --project ../Infrastructure --startup-project .
```

---

## 🛠 Necessary packages

In **Infrastructure**:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="10.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.0">
```

---

## 📌 Notes

- The `Api/Data` folder is created automatically at startup.

- In Docker, this folder is mapped to a persistent volume.

---

## 🧭 Useful Commands

```sh
dotnet ef migrations add <Name> --project ../Infrastructure --startup-project .

dotnet ef database update --project ../Infrastructure --startup-project .

dotnet ef migrations list --project ../Infrastructure --startup-project .

rm -rf Data && dotnet ef database update --project ../Infrastructure --startup-project .

```

---

## ✔️ Status

Code-First System operational.
