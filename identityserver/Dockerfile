FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Tạo thư mục với quyền root
RUN mkdir -p /https && \
    chown -R app:app /https && \
    mkdir -p /home/app/.aspnet/DataProtection-Keys && \
    chown -R app:app /home/app/.aspnet/DataProtection-Keys

USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
# Copy tất cả các file .csproj
COPY ["identityserver/identityserver.csproj", "identityserver/"]
COPY ["shared/shared.csproj", "shared/"]
RUN dotnet restore "identityserver/identityserver.csproj"

# Copy toàn bộ source code
COPY . .
WORKDIR "/src/identityserver"
RUN dotnet build "identityserver.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "identityserver.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "identityserver.dll"]