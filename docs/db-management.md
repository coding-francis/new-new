## Migration with atlas cheasheet

- Inspect database

```sh
atlas schema inspect -u postgresql://postgres:randompassword@localhost:5432/mydb?sslmode=disable
```

- Apply Declarative migration  (Only run this in development)

```sh
atlas schema apply  -u postgresql://postgres:randompassword@localhost:5432/mydb?sslmode=disable --to file://migrations/schema.hcl
```

- Create migrations
**After editing `migrations/schema.hcl` to desired state, run**

```sh
atlas migrate diff <nama of migration> \
  --dir "file://migrations/versions" \
  --to "file://migrations/schema.hcl" \
  --dev-url "docker://postgres/13/example"
```
