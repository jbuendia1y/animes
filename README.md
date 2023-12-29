# Animes

Una applicación full-stack para guardar y visualizar animes

## Desarrollo

Tienes que tener la API y la base de datos corriendo en tu máquina para poder usar la applicación

- [API Readme](./api/README.md)

- [Frontend Readme](./frontend/README.md)

## Producción

Puedes correr la app con docker compose

```bash
docker compose build

# La variable Port es opcional a cambiar
docker compose up -e PORT=3000 -e JWT_SECRET=YOUR_AWESOME_SECRET
# JWT_SECRET tiene que reemplazar su valor

# También puede usar un archivo .env
docker compose up --env-file ./.env
```

## Contribuciones

Crea una issue antes de realizar una pull request para ver que se va a cambiar
