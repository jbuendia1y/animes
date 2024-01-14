# Anime API

API Open source para obtener animes.

## Para comenzar

La API necesita conectarse a una base de datos MongoDB.

Recomendamos usar docker para no instalarlo y configurarlo en su computadora.

```bash
DATABASE_PATH=$(pwd)
docker \
    run \
    --name mymongodb \
    -e MONGO_INITDB_ROOT_USERNAME=root \
    -e MONGO_INITDB_ROOT_PASSWORD=example \
    -p 27017:27017 \
    -v "$DATABASE_PATH/.dev/mongodata:/data/db" \
    -d mongo

# Si quiere acceder a la shell del contenedor escribe lo siguiente :
docker exec -it mymongodb bash
# Para acceder a la shell de mongo :
mongosh -u root -p example
```

Crea el archivo .env

```bash
# Puedes modificar tu archivo .env
cp .env.example .env
```

Luego de tener tu base de datos, instala las dependencias e inicie el servidor

```bash
# Cache dependencies
deno cache deps.ts
# Run server
deno task dev
```

## Rutas de la API

- `/auth` requiere authenticación
- `/animes`
- `/animes/favorites` requiere authenticación
- `/tags`
- `/chapters`
- `/chapters/videos`

## Contribuciones

Lee el [Readme princial](../README.md)
