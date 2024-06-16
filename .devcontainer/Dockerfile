FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-18

WORKDIR /app
COPY . .

# Clear npm cache
RUN npm cache clean --force

EXPOSE 3000