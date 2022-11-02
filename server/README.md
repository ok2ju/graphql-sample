Run postgres:

```sh
docker run --name postgres-gql -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -d postgres
```

Add a new `prisma` migration:

```sh
npx prisma migrate dev --name add-profile
```
