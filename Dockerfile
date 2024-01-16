FROM node:18.14.0-alpine as build

WORKDIR /frontend

COPY ./frontend/ .

RUN npm i
RUN npm run build

FROM denoland/deno:alpine-1.39.4

WORKDIR /api

# get app build
COPY --from=build /frontend/dist/ /frontend/dist/

# cache dependencies
COPY ./api/deps.ts .
RUN deno cache deps.ts

COPY ./api/ .

ENV PORT=${PORT:-3000}

EXPOSE ${PORT}

CMD ["deno", "task", "start"]