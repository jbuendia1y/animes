FROM node:18.14.0-alpine as frontend

WORKDIR /frontend

COPY ./frontend/ .

RUN npm i
RUN npm run build

FROM node:18.14.0-alpine as api

WORKDIR /api

COPY --from=frontend /frontend/dist/ /frontend/dist/

COPY ./api/package.json ./api/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY ./api/ .

ENV PORT=${PORT:-3000}

EXPOSE ${PORT}

CMD ["pnpm", "run", "start:prod"]
