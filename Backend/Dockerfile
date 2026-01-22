# ==========================================
# 👉 Build stage
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

ARG APP_ENV=Production

ENV ASPNETCORE_ENVIRONMENT=${APP_ENV}

COPY Backend/ /src/Backend/

RUN cp /src/Backend/Api/appsettings.json /src/Backend/Api/appsettings.${APP_ENV}.json

RUN dotnet restore /src/Backend/Api/KansoBoard.Api.csproj
RUN dotnet publish /src/Backend/Api/KansoBoard.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# 👉 Runtime stage
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ARG APP_ENV=Production

ENV ASPNETCORE_ENVIRONMENT=${APP_ENV}

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "KansoBoard.Api.dll"]