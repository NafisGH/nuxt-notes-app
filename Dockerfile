# - stage 1: build -
FROM node:20-alpine AS build

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Сборка Nuxt в .output
RUN npm run build

# - stage 2: runtime -
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV PORT=3000

# Копируем собранный вывод
COPY --from=build /app/.output ./.output
COPY package*.json ./

EXPOSE 3000

# Запускаем Nitro-сервер
CMD ["node", ".output/server/index.mjs"]
